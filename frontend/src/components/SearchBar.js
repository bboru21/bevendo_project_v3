import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { formatSearchLabel } from '../utils/search';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCross, faMartiniGlassCitrus, faWineBottle } from "@fortawesome/free-solid-svg-icons";

const SearchBar = ({ placeholder="Search", ...restProps}) => {

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const router = useRouter();

  const containerRef = useRef(null);

  const cursor = useRef(-1);
  useEffect(() => {
    cursor.current = -1;
  });

  useEffect(() =>{

    const getData = setTimeout( async () => {
      if (searchQuery) {

        const res = await fetch(`/api/data/search?q=${searchQuery}`, {
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
    cursor.current = -1;
    const container = containerRef?.current;
    container && container.querySelector('input')?.focus();
  };

  const clearInputValue = () => {
    containerRef.current.querySelector('input').value = '';
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

    if (event.key === 'Enter') {
      if (event.target === containerRef.current.querySelector("input")) {
        event.preventDefault();
        router.push(`/search?q=${searchQuery}`);
      }
    }

    // arrow navigation
    if (['ArrowDown', 'ArrowUp'].indexOf(event.key) > -1) {
      event.preventDefault();

      const next = (event.key === 'ArrowDown');
      const previous = (event.key === 'ArrowUp');

      const container = containerRef.current;
      const results = Array.from(
        container ? container.querySelectorAll(".search-result-item a") : []
      );

      if (next && (cursor.current < results.length-1)) {
        cursor.current = cursor.current + 1;
      } else if (previous) {
        cursor.current = cursor.current -1;
      }

      if (next || previous) {
        if (results[cursor.current]) {
          const result = results[cursor.current];
          result.focus();
        } else {
          focusOnInput();
        }
      }
    }
  }

  const handleClick = (event) => {
    setSearchQuery('');
    setShowSearchResults(false);
    clearInputValue();
  };

  // TODO resolve mobile issues
  // const handleBlur = (event) => {
  //   const node = event.relatedTarget;
  //   if (!containerRef.current?.contains(node)) {
  //     setSearchQuery('');
  //     setShowSearchResults(false);
  //     clearInputValue();
  //   }
  // };

  return (
    <div
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      // onBlur={handleBlur}
      ref={containerRef}
      className="search-bar"
      {...restProps}
    >
      <form className='d-flex' role='search'>
        <input
          className='form-control me-2'
          type='search'
          placeholder={placeholder}
          aria-label={placeholder}
          onChange={handleChange}
        />
        {/* <button className='btn btn-outline-success' type='submit'>Search</button> */}
      </form>
      {showSearchResults && searchResults.length > 0 && (
        <ul className="search-result-list">
          {searchResults.map( result => {

            let icon;
            switch(result.type) {
              case "cocktail":
                icon = faMartiniGlassCitrus;
                break;
              case "ingredient":
                icon = faWineBottle;
                break;
              default:
                icon = faCross;
            }

            return (
              <li key={result.value} className="search-result-item">
                  {result.value ? (
                    <Link href={result.value} legacyBehavior>
                      <a className="px-2 py-1 link-secondary" onClick={handleClick}>
                        <FontAwesomeIcon icon={icon} size="1x" className="me-1" />
                        {formatSearchLabel(result.label, result.q)}
                      </a>
                    </Link>
                  ) : (
                    <div className="px-2 py-1">{result.label}</div>
                  )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;