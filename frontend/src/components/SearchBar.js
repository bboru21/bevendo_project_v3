import React, { useState, useEffect } from 'react';

const SearchBar = () => {

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() =>{

    const getData = setTimeout( async () => {
      if (searchQuery) {
        console.log('***',  searchQuery);
      }
    }, 300);
    
    return () => clearTimeout(getData);

  }, [searchQuery]);

  const handleChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
  }

  return (
    <form className='d-flex' role='search'>
      <input className='form-control me-2' type='search' placeholder='Search' aria-label='Search' onChange={handleChange} />
      <button className='btn btn-outline-success' type='submit'>Search</button>
    </form>
  );
}

export default SearchBar;