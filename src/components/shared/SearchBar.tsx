// SearchBar component for filtering data in management pages
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { debounce } from 'lodash-es';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  style?: React.CSSProperties;
  debounceTime?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Tìm kiếm...",
  value,
  onChange,
  style,
  debounceTime = 300
}) => {
  // Use local state to immediately update the input field
  const [localValue, setLocalValue] = useState(value);
  
  // Create a debounced version of onChange
  const debouncedOnChange = useMemo(
    () => debounce((newValue: string) => {
      onChange(newValue);
    }, debounceTime),
    [onChange, debounceTime]
  );
  
  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);
  
  // Handle input change with local update and debounced API call
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue); // Update local state immediately for responsive UI
    debouncedOnChange(newValue); // Trigger API call after debounce
  }, [debouncedOnChange]);
  
  // Handle clear action
  const handleClear = useCallback(() => {
    setLocalValue('');
    debouncedOnChange('');
  }, [debouncedOnChange]);
  
  return (
    <div style={{ ...style }}>
      <Input
        placeholder={placeholder}
        prefix={<SearchOutlined />}
        value={localValue}
        onChange={handleInputChange}
        allowClear
        style={{ width: '100%' }}
        onClear={handleClear}      />
    </div>
  );
};

export default SearchBar;
