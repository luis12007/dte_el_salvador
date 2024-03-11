import React from 'react';

const InputLoginComponent = ({placeholder, icon, onchange }) => {
  return (
    <div className="relative">
      <input
        className="border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:border-gray-500 hover:border-gray-500" placeholder={placeholder} onChange={onchange}
      />
      <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
        <img className='h-6 ' src={icon} alt="icon" />
      </div>
    </div>
  );
};

export default InputLoginComponent;