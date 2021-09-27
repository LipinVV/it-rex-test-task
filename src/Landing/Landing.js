import './landing.scss';
import React, {useEffect, useState} from "react";
import {fetchCharacters} from "../App";
import {v4 as uudv4} from 'uuid';

export const Landing = ({pageSize}) => {

    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);

    const getAllData = async () => {
        try {
            const allWordsFromServer = await fetchCharacters(pageSize)
            setUsers(allWordsFromServer)
            setFilteredUsers(allWordsFromServer)
        } catch (error) {
            console.error(error)
        }
    }

    const inputFilterHandler = (inputValue, allUsers) => {
        const filteredArray = allUsers.filter((user) => {
            console.log('user', user)
            if (inputValue === '') {
                return user;
            }
            if (user.firstName.toLowerCase().includes(inputValue.toLowerCase()) ||
                user.lastName.toLowerCase().includes(inputValue.toLowerCase())) {
                return user;
            }
        })
        setFilteredUsers(filteredArray)
    }
    const [filterOptions, setFilterOptions] = useState(['id', 'firstName', 'lastName', 'email', 'phone', 'state'])

    useEffect(() => {
        getAllData()
    }, [pageSize])

    const [openedCard, setOpenedCard] = useState([]);
    const popUpHandler = index => {
        setOpenedCard((prevState) => {
            if (prevState.includes(index)) {
                setStatus(false)
                return prevState.filter(value => value !== index)
            } else {
                setStatus(true)
                return [...prevState, index]
            }
        })
    }
    const [status, setStatus] = useState(false)


    const [one, setOne] = useState([])
    const [add, setAdd] = useState([])
    const filterByAmount = (value, array) => {
        setAdd((prevState) => {
            if (prevState.includes(value)) {
                return prevState.filter(element => element !== value)
            } else {
                return [...prevState, value]
            }
        })
        if (Boolean(value === 'firstName' || value === 'lastName' || value === 'email' || value === 'phone')) {
            let sortingArray;
            if (add.includes('firstName') || add.includes('lastName') || add.includes('email') || add.includes('phone')) {
                sortingArray = array.sort((productA, productB) => {
                    return productA[value].localeCompare(productB[value])
                })
            } else {
                sortingArray = array.sort((productA, productB) => {
                    return productB[value].localeCompare(productA[value])
                })
            }
            setFilteredUsers(sortingArray)
        }
        if (Boolean(value === 'id' || value === 'phone')) {
            let sortingArray;
            if (add.includes('id')) {
                sortingArray = array.sort((productA, productB) => {
                    return productA[value] - productB[value]
                })
            } else {
                sortingArray = array.sort((productA, productB) => {
                    return productB[value] - productA[value]
                })
            }
            setFilteredUsers(sortingArray)
        }
        if(Boolean(value === 'state')) {
            let sortingArray;
            if (add.includes('state')) {
                sortingArray = array.sort((productA, productB) => {
                    return productA.adress.state.localeCompare(productB.adress.state)
                })
            } else {
                sortingArray = array.sort((productA, productB) => {
                    return productB.adress.state.localeCompare(productA.adress.state)
                })
            }
            setFilteredUsers(sortingArray)
        }

    }
    console.log('add', add)
    console.log('filteredUsers', filteredUsers)
    return (
        <div>
            <div>
                <label className='widget__filter-label'>
                    <input
                        className='widget__filter-input'
                        type='text'
                        placeholder='type a name...'
                        onChange={(evt) => inputFilterHandler(evt.target.value, users)}
                    />
                </label>
            </div>
            <section className='users'>
                <div className='users__filter-options'>
                    {filterOptions.map(option => {
                        return (
                            <label key={uudv4()}><input checked={add.includes(option)} value={option} type='checkbox'
                                                        onChange={(evt) => filterByAmount(evt.target.value, users)}/>{option}
                            </label>
                        )
                    })}
                < /div>
                {Boolean(filteredUsers.length > 0) && filteredUsers.slice(0, 10).map((user, index) => {
                    let showStatus = false
                    if (openedCard.includes(index)) {
                        showStatus = true;
                    }

                    return (
                        <div key={uudv4()}>
                            <div
                                key={uudv4()}
                                className='users__user'
                                onClick={() => popUpHandler(index)}
                            >
                                <p className='users__user-information'>{user.id}</p>
                                <p className='users__user-information'>{user.firstName}</p>
                                <p className='users__user-information'>{user.lastName}</p>
                                <p className='users__user-information'>{user.email}</p>
                                <p className='users__user-information'>{user.phone}</p>
                                <p className='users__user-information'>{user.adress.state}</p>
                            </div>
                            {showStatus === true && status === true &&
                            <section className='users__user-pop-up'>Profile info:
                                <ul>
                                    <li>Selected profile: {user.firstName}</li>
                                    <li>Description: {user.description}</li>
                                    <li>Address: {user.adress.streetAddress}</li>
                                    <li>City: {user.adress.city}</li>
                                    <li>State: {user.adress.state}</li>
                                    <li>Index: {user.adress.zip}</li>
                                </ul>
                            </section>
                            }
                        </div>
                    )
                })}
            </section>
        </div>
    )
}