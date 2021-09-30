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
            const allWordsFromServer = await fetchCharacters();
            setUsers(allWordsFromServer);
            setFilteredUsers(allWordsFromServer);
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
            setPage(1);
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
            console.log(value)
            let sortingArray;
            if (sortedUsers.includes(value)) {
                sortingArray = array.sort((productA, productB) => {
                    return productB[value].localeCompare(productA[value]);
                })
            } else {
                sortingArray = array.sort((productA, productB) => {
                    return productA[value].localeCompare(productB[value]);
                })
            }
            setFilteredUsers(sortingArray);
        }
        if (Boolean(value === 'id')) {
            console.log(value)
            let sortingArray;
            if (sortedUsers.includes('id')) {
                sortingArray = array.sort((productA, productB) => {
                    return productB[value] - productA[value];
                })
            } else {
                sortingArray = array.sort((productA, productB) => {
                    return productA[value] - productB[value];
                })
            }
            setFilteredUsers(sortingArray);
        }
        if (Boolean(value === 'state')) {
            console.log(value)
            let sortingArray;
            if (sortedUsers.includes('state')) {
                sortingArray = array.sort((productA, productB) => {
                    return productB.adress.state.localeCompare(productA.adress.state);
                })
            } else {
                sortingArray = array.sort((productA, productB) => {
                    return productA.adress.state.localeCompare(productB.adress.state);
                })
            }
            setFilteredUsers(sortingArray);
        }
    }
    console.log(sortedUsers)
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

    const states = users.map(user => user.adress.state);
    const [selectedUserState, setSelectedState] = useState('');
    const selectHandler = (value, array) => {
        setSelectedState(value);
        const filtteredArray = array.filter(user => {
            return user.adress.state === value;
        })
        setFilteredUsers(filtteredArray);
    }

    const numberGenerator = Math.round(filteredUsers.length / 20);
    const arrayWithPageNumbers = Array(numberGenerator).fill().map((element, index) => index + 1);

    return (
        <div className='wrapper'>
            <section className='users__filter'>
                <label className='users__filter-label'>
                    <input
                        className='users__filter-input'
                        type='text'
                        placeholder='Search by name...'
                        onChange={evt => inputFilterHandler(evt.target.value, users)}
                    />
                </label>
                <select
                    className='users__states'
                    value={selectedUserState}
                    onChange={evt => selectHandler(evt.target.value, users)}
                >
                    {selectedUserState === '' && <option>Filter by state</option>}
                    {states.map(state => {
                        return (
                            <option
                                className='users__state'
                                key={uudv4()}>
                                {state}
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
                                <label
                                    className={sortedUsers.includes(option) ? 'users__filter-label' : 'users__filter-label users__filter-label-active'}>
                                    <input
                                        className='users__filter-checkbox'
                                        checked={sortedUsers.includes(option)}
                                        value={option}
                                        type='checkbox'
                                        onChange={(evt) => filterByAmount(evt.target.value, filteredUsers)}/>
                                    {option}
                                </label>
                            </th>
                        )
                    })}
                < /tr>
                </thead>
                {Boolean(currentItems.length > 0) && currentItems.map((user, index) => {
                    let showStatus = false;
                    if (openedCard.includes(index)) {
                        showStatus = true;
                    }
                    return (
                        <tbody key={uudv4()}>
                        <tr onClick={() => popUpHandler(index)}
                            className={!showStatus ? 'users__user' : 'users__user users__user-active'}>
                            <td className='users__user-information'>{user.id}</td>
                            <td className='users__user-information'>{user.firstName}</td>
                            <td className='users__user-information'>{user.lastName}</td>
                            <td className='users__user-information'>{user.email}</td>
                            <td className='users__user-information'>{user.phone}</td>
                            <td className='users__user-information'>{user.adress.state}</td>
                        </tr>
                        {showStatus === true &&
                        <tr className='users__user-pop-up'>
                            <td className='users__user-pop-up-info'>Profile info:</td>
                            <td className='users__user-pop-up-info'>Selected profile: {user.firstName}</td>
                            <td className='users__user-pop-up-info'>Description: {user.description}</td>
                            <td className='users__user-pop-up-info'>Address: {user.adress.streetAddress}</td>
                            <td className='users__user-pop-up-info'>City: {user.adress.city}</td>
                            <td className='users__user-pop-up-info'>State: {user.adress.state}</td>
                            <td className='users__user-pop-up-info'>Index: {user.adress.zip}</td>
                        </tr>
                        }
                        </tbody>
                    )
                })}
            </table>
            <div className='pagination-controls'>
                <div className='pagination-buttons'>
                    <button disabled={page === 1}
                            className='pagination-button'
                            onClick={handleClickDecrease}>Previous
                    </button>
                    {Boolean(arrayWithPageNumbers.length > 0) && arrayWithPageNumbers.map(value => {
                        return (
                            <button
                                key={uudv4()}
                                onClick={() => setPage(value)}
                                disabled={page === value}
                                className='pagination-button'
                            >
                                {value}
                            </button>
                        )
                    })
                    }
                    <button
                        disabled={indexOfLastItem === users.length}
                        className='pagination-button'
                        onClick={handleClickIncrease}>Next
                    </button>
                </div>
            </div>
        </div>
    )
}