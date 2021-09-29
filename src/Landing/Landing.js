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

    useEffect(() => {
        if (currentItems < PAGE_SIZE) {
            setPage(1)
        }
    }, [currentItems])

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

    const states = users.map(user => user.adress.state)

    const selectHandler = (value, array) => {
        const filtteredArray = array.filter(user => {
            return user.adress.state === value
        })
        setFilteredUsers(filtteredArray)
    }

    console.log('=>', currentItems)
    const numberGenerator = Math.round(filteredUsers.length / 20);

    const arrayWithPageNumbers = Array(numberGenerator).fill().map((element, index) => index + 1);

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
                    onChange={(evt) => selectHandler(evt.target.value, users)}
                >
                    {states.map((user, index) => {
                        return (
                            <option
                                className='users__user'
                                key={uudv4()}>
                                {user}
                            </option>
                        )
                    })}
                </select>
            </section>
            <table className='users'>
                <thead>
                <tr className='users__filter-options'>
                    {filterOptions.map(option => {
                        return (
                            <th key={uudv4()}>
                                <input
                                    checked={sortedUsers.includes(option)}
                                    value={option}
                                    type='checkbox'
                                    onChange={(evt) => filterByAmount(evt.target.value, filteredUsers)}/>
                                {option}
                            </th>
                        )
                    })}
                < /tr>
                </thead>
                {Boolean(currentItems.length > 0) && currentItems.map((user, index) => {
                    let showStatus = false
                    if (openedCard.includes(index)) {
                        showStatus = true;
                    }
                    return (
                        <tbody key={uudv4()}>
                        <tr onClick={() => popUpHandler(index)} className='users__user'>
                            <td className='users__user-information'>{user.id}</td>
                            <td className='users__user-information'>{user.firstName}</td>
                            <td className='users__user-information'>{user.lastName}</td>
                            <td className='users__user-information'>{user.email}</td>
                            <td className='users__user-information'>{user.phone}</td>
                            <td className='users__user-information'>{user.adress.state}</td>
                        </tr>
                        {showStatus === true &&
                        <tr className='users__user-pop-up'>
                            <td>Profile info:</td>
                            <td>Selected profile: {user.firstName}</td>
                            <td>Description: {user.description}</td>
                            <td>Address: {user.adress.streetAddress}</td>
                            <td>City: {user.adress.city}</td>
                            <td>State: {user.adress.state}</td>
                            <td>Index: {user.adress.zip}</td>
                        </tr>
                        }
                        </tbody>
                    )
                })}
            </table>
            <div className='pagination-controls'>
                <div className='pagination-buttons'>
                    <button disabled={page === 1} className='pagination-button'
                            onClick={handleClickDecrease}>{'Previous page'}</button>
                    {Boolean(arrayWithPageNumbers.length > 0) && arrayWithPageNumbers.map(value => {
                        return (
                            <button
                                key={uudv4()}
                                onClick={() => setPage(value)}
                                disabled={page === value}
                            >
                                {value}
                            </button>
                        )
                    })
                    }
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