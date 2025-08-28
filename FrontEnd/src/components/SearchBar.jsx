import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

function SearchBar({active}) {
    return (
        <div className='searchBar'>
            <label htmlFor="search">
                <FontAwesomeIcon icon={faMagnifyingGlass} className='searchIcon' />

            </label>
            <input type="text" id='search' name="search" placeholder={" Search "+active} className='searchInput' />
        </div>
    )
}

export default SearchBar