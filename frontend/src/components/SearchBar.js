import React, { useState, useEffect } from 'react';
// import cookie from 'cookie';
import { API_URL } from '../config/index';
import Link from 'next/link';

const SearchBar = () => {

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() =>{

    const getData = setTimeout( async () => {
      if (searchQuery) {
        
        const res = await fetch(`/api/search?q=${searchQuery}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        });

        if (res.status === 200) {
          const data = await res.json();
          setSearchResults(data.results);
        }
      }
    }, 300);
    
    return () => clearTimeout(getData);

  }, [searchQuery]);

  useEffect(() =>{
    if (searchQuery === '') {
      setShowSearchResults(false);
    } else {
      setShowSearchResults(true);
    }
  }, [searchQuery]);

  const handleChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
  }

  return (
    <div style={{ position: 'relative' }}>
      <form className='d-flex' role='search'>
        <input className='form-control me-2' type='search' placeholder='Search' aria-label='Search' onChange={handleChange} />
        {/* <button className='btn btn-outline-success' type='submit'>Search</button> */}
      </form>
      {showSearchResults && searchResults.length > 0 && (
        <ul style={{ position: 'absolute', 'listStyle': 'none' }}>
          {searchResults.map( result => (
            <li key={result.value}>
              <Link href={result.value}>{result.label}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;