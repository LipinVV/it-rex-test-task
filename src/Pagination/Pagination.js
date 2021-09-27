import React, {useState} from "react";


export const Pagination = ({pageSize}) => {
    const [currentPageNumber, setCurrentPageNumber] = useState(pageSize);

    const handleClickIncreasePageNumber = () => {
        setCurrentPageNumber(prevState => prevState + 1);
    }

    const handleClickDecreasePageNumber = () => {
        setCurrentPageNumber(prevState => prevState - 1);
    }

    return (
        <div>
            <div className='app__control-buttons'>
                <button
                    className='app__control-button'
                    type='button'
                    onClick={handleClickDecreasePageNumber}
                    disabled={currentPageNumber === 1}
                >Previous page
                </button>
                <button
                    className='app__control-button'
                    type='button'
                    onClick={handleClickIncreasePageNumber}
                >Next page</button>
                {currentPageNumber === 34 &&
                <button
                    className='app__control-button app__control-button-return'
                    type='button'
                    onClick={() => setCurrentPageNumber(1)}
                >
                    To the first page
                </button>}
                <span className='app__control-current-page'>current page is: {currentPageNumber}</span>
            </div>
        </div>
    )
}