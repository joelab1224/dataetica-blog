'use client';

import { useState } from 'react';

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function SearchBar({ 
  value = '',
  onChange,
  placeholder = 'Buscar...',
  className = '',
  disabled = false
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className={`search-bar ${className}`}>
      <label htmlFor="search" className="search-bar-label">
        Buscar artículos
      </label>
      <div className="search-bar-container">
        <input
          type="text"
          id="search"
          value={inputValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className="search-bar-input"
        />
        <div className="search-bar-icon">
          <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </div>
  );
}