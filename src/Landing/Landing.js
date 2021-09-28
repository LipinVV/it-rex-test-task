import './landing.scss';
import React, {useEffect, useState} from "react";
import {fetchCharacters} from "../App";
import {v4 as uudv4} from 'uuid';

export const Landing = () => {

    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const filterOptions = ['id', 'firstName', 'lastName', 'email', 'phone', 'state'];

    const getAllData = async () => {
        try {
            const allWordsFromServer = await fetchCharacters()
            setUsers(allWordsFromServer)
            setFilteredUsers(allWordsFromServer)
        } catch (error) {
            console.error(error)
        }
    }

    const [page, setPage] = useState(1);
    const PAGE_SIZE = 20;

    const indexOfLastItem = page * PAGE_SIZE;
    const indexOfFirstItem = indexOfLastItem - PAGE_SIZE;

    const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

    function handleClickIncrease() {
        setPage(prevState => prevState + 1);
    }

    function handleClickDecrease() {
        setPage(prevState => prevState - 1);
    }

    const inputFilterHandler = (inputValue, allUsers) => {
        const filteredArray = allUsers.filter((user) => {
            if (inputValue === '') {
                return user;
            }
            if (user.firstName.toLowerCase().includes(inputValue.toLowerCase())) {
                return user;
            }
        })
        setFilteredUsers(filteredArray);
    }

    useEffect(() => {
        getAllData()
    }, [])


    const [sortedUsers, setSortedUsers] = useState([]);
    const filterByAmount = (value, array) => {
        setSortedUsers((prevState) => {
            if (prevState.includes(value)) {
                return prevState.filter(element => element !== value);
            } else {
                return [...prevState, value];
            }
        })
        if (Boolean(value === 'firstName' || value === 'lastName' || value === 'email' || value === 'phone')) {
            let sortingArray;
            if (sortedUsers.includes('firstName') || sortedUsers.includes('lastName') || sortedUsers.includes('email') || sortedUsers.includes('phone')) {
                sortingArray = array.sort((productA, productB) => {
                    return productA[value].localeCompare(productB[value]);
                })
            } else {
                sortingArray = array.sort((productA, productB) => {
                    return productB[value].localeCompare(productA[value]);
                })
            }
            setFilteredUsers(sortingArray);
        }
        if (Boolean(value === 'id' || value === 'phone')) {
            let sortingArray;
            if (sortedUsers.includes('id')) {
                sortingArray = array.sort((productA, productB) => {
                    return productA[value] - productB[value];
                })
            } else {
                sortingArray = array.sort((productA, productB) => {
                    return productB[value] - productA[value];
                })
            }
            setFilteredUsers(sortingArray);
        }
        if (Boolean(value === 'state')) {
            let sortingArray;
            if (sortedUsers.includes('state')) {
                sortingArray = array.sort((productA, productB) => {
                    return productA.adress.state.localeCompare(productB.adress.state)
                })
            } else {
                sortingArray = array.sort((productA, productB) => {
                    return productB.adress.state.localeCompare(productA.adress.state)
                })
            }
            setFilteredUsers(sortingArray);
        }
    }

    const [openedCard, setOpenedCard] = useState([]);
    const popUpHandler = index => {
        setOpenedCard((prevState) => {
            if (prevState.includes(index)) {
                return prevState.filter(value => value !== index);
            } else {
                return [...prevState.slice(0, -1), index];
            }
        })
    }

    const selectHandler = (value) => {

    }

    console.log('=>', currentItems)
    return (
        <div className='wrapper'>
            <section className='users__filter'>
                <label className='users__filter-label'>
                    <input
                        className='users__filter-input'
                        type='text'
                        placeholder='type a name...'
                        onChange={(evt) => inputFilterHandler(evt.target.value, users)}
                    />
                </label>
                <select
                    onChange={(evt) => selectHandler(evt.target.value)}
                >
                    {currentItems.map((user, index) => {
                        return (
                            <option
                                className='users__user'
                                key={uudv4()}>
                                {user.adress.state}
                            </option>
                        )
                    })}
                </select>
            </section>
            <section className='users'>
                <div className='users__filter-options'>
                    {filterOptions.map(option => {
                        return (
                            <label key={uudv4()}>
                                <input
                                    checked={sortedUsers.includes(option)}
                                    value={option}
                                    type='checkbox'
                                    onChange={(evt) => filterByAmount(evt.target.value, users)}/>
                                {option}
                            </label>
                        )
                    })}
                < /div>
                {Boolean(currentItems.length > 0) && currentItems.slice(0, PAGE_SIZE).map((user, index) => {
                    let showStatus = false
                    if (openedCard.includes(index)) {
                        showStatus = true;
                    }
                    return (
                        <section className='users__user' key={uudv4()}>
                            <div
                                className='users__user-data'
                                onClick={() => popUpHandler(index)}
                            >
                                <p className='users__user-information'>{user.id}</p>
                                <p className='users__user-information'>{user.firstName}</p>
                                <p className='users__user-information'>{user.lastName}</p>
                                <p className='users__user-information'>{user.email}</p>
                                <p className='users__user-information'>{user.phone}</p>
                                <p className='users__user-information'>{user.adress.state}</p>
                            </div>
                            {showStatus === true &&
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
                        </section>
                    )
                })}
            </section>
            <div className='pagination-controls'>
                <div className='pagination-buttons'>
                    <button disabled={page === 1} className='pagination-button'
                            onClick={handleClickDecrease}>{'Previous page'}</button>
                    <button disabled={indexOfLastItem === users.length} className='pagination-button'
                            onClick={handleClickIncrease}>{'Next page'}</button>
                </div>
                <div className='pagination-current-page'>
                    You are on the: {page} page
                </div>
            </div>
        </div>
    )
}