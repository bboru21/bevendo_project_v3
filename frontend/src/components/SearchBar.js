import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { API_URL } from '../config/index';
import Link from 'next/link';

const SearchBar = () => {

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const containerRef = useRef(null);

  let cursor = -1;
  useEffect(() => {
    cursor = -1;
  });

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

  const focusOnInput = () => {
    // reset arrow navigation cursor, and set focus to input element
    cursor = -1;
    const container = containerRef?.current;
    container && container.querySelector('input')?.focus();
  };

  const clearInputValue = () => {
    containerRef.current.querySelector('input').value = '';
  }

  const handleBlur = (event) => {
    /*
      On component container blur, close search if newly focused element is
      not a child of the container.
    */
   
    const node = event.relatedTarget;
    if (node && !containerRef.current?.contains(node)) {
      setShowSearchResults(false);
    }
  }

  const handleFocus = () => {
    if (searchQuery !== '') {
      setShowSearchResults(true);
    }
  }

  const handleChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
  }

  const handleKeyDown = (event) => {

    // arrow navigation
    if (['ArrowDown', 'ArrowUp'].indexOf(event.key) > -1) {
      event.preventDefault();

      const next = (event.key === 'ArrowDown');
      const previous = (event.key === 'ArrowUp');

      const container = containerRef.current;
      const results = Array.from(
        container ? container.querySelectorAll(".search-result-item a") : []
      );

      if (next && (cursor < results.length-1)) {
        cursor = cursor + 1;
      } else if (previous) {
        cursor = cursor -1;
      }

      if (next || previous) {
        if (results[cursor]) {
          const result = results[cursor];
          result.focus();
        } else {
          focusOnInput();
        }
      }
    }
  }

  const router = useRouter();
  const handleClick = (event) => {
    event.preventDefault();
    router.push(event.target.href);

    setSearchQuery('');
    setShowSearchResults(false);
    clearInputValue();
  };

  return (
    <div
      onFocus={handleFocus} 
      onKeyDown={handleKeyDown} 
      onBlur={handleBlur} 
      ref={containerRef}
      className="search-bar"
    >
      <form className='d-flex' role='search'>
        <input 
          className='form-control me-2' 
          type='search' 
          placeholder='Search' 
          aria-label='Search' 
          onChange={handleChange}
        />
        {/* <button className='btn btn-outline-success' type='submit'>Search</button> */}
      </form>
      {showSearchResults && searchResults.length > 0 && (
        <ul className="search-result-list">
          {searchResults.map( result => (
            <li key={result.value} className="search-result-item">
                <a className="px-2 py-1 link-secondary" href={result.value} onClick={handleClick}>{result.label}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;