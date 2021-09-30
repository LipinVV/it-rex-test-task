import './usersTemplate.scss';
import React, {useEffect, useState} from "react";
import {fetchCharacters} from "../App";
import {v4 as uudv4} from 'uuid';
import {useDispatch} from "react-redux";
import {getUserData} from "../actions/actions";

export const UsersTemplate = () => {
    const dispatch = useDispatch();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const filterOptions = ['id', 'firstName', 'lastName', 'email', 'phone', 'state'];

    const getAllData = async () => {
        try {
            const allWordsFromServer = await fetchCharacters();
            setUsers(allWordsFromServer);
            setFilteredUsers(allWordsFromServer);
        } catch (error) {
            console.error('Dear client, something went wrong: ', error)
        }
    }

    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 20;

    const indexOfLastItem = currentPage * PAGE_SIZE;
    const indexOfFirstItem = indexOfLastItem - PAGE_SIZE;
    const currentUsersOnThePage = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

    function handleClickIncrease() {
        setCurrentPage(prevState => prevState + 1);
    }
    function handleClickDecrease() {
        setCurrentPage(prevState => prevState - 1);
    }

    useEffect(() => {
        if (currentUsersOnThePage < PAGE_SIZE) {
            setCurrentPage(1);
        }
    }, [currentUsersOnThePage])

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

    const [chosenSortingOptions, setChosenSortingOptions] = useState([]);
    const filterByAmount = (sortingOption, array) => {
        setChosenSortingOptions((prevState) => {
            if (prevState.includes(sortingOption)) {
                return prevState.filter(element => element !== sortingOption);
            } else {
                return [...prevState, sortingOption];
            }
        })
        if (Boolean(sortingOption === 'firstName' || sortingOption === 'lastName' || sortingOption === 'email' || sortingOption === 'phone')) {
            let sortedArray;
            if (chosenSortingOptions.includes(sortingOption)) {
                sortedArray = array.sort((sortingOptionA, sortingOptionB) => {
                    return sortingOptionB[sortingOption].localeCompare(sortingOptionA[sortingOption]);
                })
            } else {
                sortedArray = array.sort((sortingOptionA, sortingOptionB) => {
                    return sortingOptionA[sortingOption].localeCompare(sortingOptionB[sortingOption]);
                })
            }
            setFilteredUsers(sortedArray);
        }
        if (Boolean(sortingOption === 'id')) {
            let sortedArray;
            if (chosenSortingOptions.includes('id')) {
                sortedArray = array.sort((sortingOptionA, sortingOptionB) => {
                    return sortingOptionB[sortingOption] - sortingOptionA[sortingOption];
                })
            } else {
                sortedArray = array.sort((sortingOptionA, sortingOptionB) => {
                    return sortingOptionA[sortingOption] - sortingOptionB[sortingOption];
                })
            }
            setFilteredUsers(sortedArray);
        }
        if (Boolean(sortingOption === 'state')) {
            let sortedArray;
            if (chosenSortingOptions.includes('state')) {
                sortedArray = array.sort((sortingOptionA, sortingOptionB) => {
                    return sortingOptionB.adress.state.localeCompare(sortingOptionA.adress.state);
                })
            } else {
                sortedArray = array.sort((sortingOptionA, sortingOptionB) => {
                    return sortingOptionA.adress.state.localeCompare(sortingOptionB.adress.state);
                })
            }
            setFilteredUsers(sortedArray);
        }
    }

    const [userCardToShow, setUserCardToShow] = useState([]);
    const popUpHandler = index => {
        setUserCardToShow((prevState) => {
            if (prevState.includes(index)) {
                return prevState.filter(value => value !== index);
            } else {
                let number = [...prevState.slice(0, -1), index]
                dispatch(getUserData(currentUsersOnThePage[number]))
                return [...prevState.slice(0, -1), index];
            }
        })
        dispatch(getUserData(currentUsersOnThePage[index]))
    }
    const usersCountryStates = users.map(user => user.adress.state);
    const uniqueUsersCountryStates = [...new Set(usersCountryStates)];
    const [selectedUserCountryState, setSelectedUserCountryState] = useState('');
    const selectHandler = (value, users) => {
        setSelectedUserCountryState(value);
        const filteredArray = users.filter(user => {
            return user.adress.state === value;
        })
        setFilteredUsers(filteredArray);
    }

    const numberGenerator = Math.round(filteredUsers.length / PAGE_SIZE);
    const generatedArrayOfPageNumbers = Array(numberGenerator).fill().map((element, index) => index + 1);

    return (
        <div className='users-template'>
            <section className='users-template__filter'>
                <label className='users-template__filter-label'>
                    <input
                        className='users-template__filter-input'
                        type='text'
                        placeholder='Search by name...'
                        onChange={evt => inputFilterHandler(evt.target.value, users)}
                    />
                </label>
                <select
                    value={selectedUserCountryState}
                    className='users-template__states'
                    onChange={evt => selectHandler(evt.target.value, users)}
                >
                    {selectedUserCountryState === '' && <option>Filter by state</option>}
                    {uniqueUsersCountryStates.map(state => {
                        return (
                            <option
                                value={state}
                                className='users-template__state'
                                key={uudv4()}>
                                {state}
                            </option>
                        )
                    })}
                </select>
            </section>
            <table className='users-template__template-of-users'>
                <thead>
                <tr className='users-template__filter-options'>
                    {filterOptions.map(option => {
                        return (
                            <th key={uudv4()}>
                                <label
                                    className={chosenSortingOptions.includes(option) ? 'users-template__filter-label' : 'users-template__filter-label users-template__filter-label-active'}>
                                    <input
                                        className='users-template__filter-checkbox'
                                        checked={chosenSortingOptions.includes(option)}
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
                {Boolean(currentUsersOnThePage.length > 0) && currentUsersOnThePage.map((user, index) => {
                    let userCardShowStatus = false;
                    if (userCardToShow.includes(index)) {
                        userCardShowStatus = true;
                    }
                    return (
                        <tbody key={uudv4()}>
                        <tr onClick={() => popUpHandler(index)}
                            className={!userCardShowStatus ? 'users-template__user' : 'users-template__user users-template__user-active'}>
                            <td className='users-template__user-information'>{user.id}</td>
                            <td className='users-template__user-information'>{user.firstName}</td>
                            <td className='users-template__user-information'>{user.lastName}</td>
                            <td className='users-template__user-information'>{user.email}</td>
                            <td className='users-template__user-information'>{user.phone}</td>
                            <td className='users-template__user-information'>{user.adress.state}</td>
                        </tr>
                        {userCardShowStatus === true &&
                        <tr className='users-template__user-pop-up'>
                            <td className='users-template__pop-up-info'>Profile info:</td>
                            <td className='users-template__pop-up-info'>Selected profile: {user.firstName}</td>
                            <td className='users-template__pop-up-info'>Description: {user.description}</td>
                            <td className='users-template__pop-up-info'>Address: {user.adress.streetAddress}</td>
                            <td className='users-template__pop-up-info'>City: {user.adress.city}</td>
                            <td className='users-template__pop-up-info'>State: {user.adress.state}</td>
                            <td className='users-template__pop-up-info'>Index: {user.adress.zip}</td>
                        </tr>
                        }
                        </tbody>
                    )
                })}
            </table>
            <section className='users-template__pagination-controls'>
                <div className='users-template__pagination-buttons'>
                    <button disabled={currentPage === 1}
                            className='users-template__pagination-button'
                            onClick={handleClickDecrease}>Previous
                    </button>
                    {Boolean(generatedArrayOfPageNumbers.length > 0) && generatedArrayOfPageNumbers.map(number => {
                        return (
                            <button
                                key={uudv4()}
                                onClick={() => setCurrentPage(number)}
                                disabled={currentPage === number}
                                className='users-template__pagination-button'
                            >
                                {number}
                            </button>
                        )
                    })
                    }
                    <button
                        disabled={indexOfLastItem === users.length}
                        className='users-template__pagination-button'
                        onClick={handleClickIncrease}>Next
                    </button>
                </div>
            </section>
        </div>
    )
}