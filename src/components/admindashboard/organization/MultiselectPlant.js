import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { plantAccessOptions } from '../../../utils/departments';

const MultiselectPlant = ({ value, onChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (plantValue) => {
    const currentSelections = Array.isArray(value) ? value : [];
    const updatedSelections = currentSelections.includes(plantValue)
      ? currentSelections.filter(item => item !== plantValue)
      : [...currentSelections, plantValue];
    
    onChange(updatedSelections);
  };

  const getDisplayText = () => {
    if (!Array.isArray(value) || value.length === 0) return 'Select Plant';
    if (value.length === 1) {
      return plantAccessOptions.find(option => option.value === value[0])?.label;
    }
    return `${value.length} plants selected`;
  };

  return (
    <div className="space-y-2 mb-12 relative" ref={dropdownRef}>
      <label className="text-sm  text-[#424955] font-bold" style={{
        fontFamily: "Inter, sans-serif"
      }}>
        Plant
      </label>
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full p-2 border rounded-md bg-[#F1FBFF] ${
            error ? "border-red-500" : "border-[#ABE7FF]"
          } flex justify-between items-center text-left`}
        >
          <span className="text-sm">{getDisplayText()}</span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>

        {isOpen && (
          <div className="absolute z-50 left-0 right-0 mt-1 bg-[#ABE7FF] border border-[#ABE7FF] rounded-md shadow-lg">
            <div className="max-h-64 overflow-y-auto rounded-md">
              {plantAccessOptions.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center px-3 py-2 bg-[#F1FBFF] hover:bg-gray-100 cursor-pointer"
                  onClick={() => toggleOption(option.value)}
                >
                  <div className="w-5 h-5 border-2 border-[#2B86AA] rounded mr-2 flex items-center justify-center flex-shrink-0 bg-white">
                    {Array.isArray(value) && value.includes(option.value) && (
                      <Check className="h-4 w-4 text-[#2B86AA] font-bold" />
                    )}
                  </div>
                  <span className="text-sm truncate">{option.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export default MultiselectPlant;