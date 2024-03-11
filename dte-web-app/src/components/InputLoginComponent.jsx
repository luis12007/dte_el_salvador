import React from 'react';

const InputLoginComponent = ({ icon, ...rest }) => {
  return (
    <div className="relative">
      <input
        className="border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:border-gray-500 hover:border-gray-500"
        {...rest}
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        {icon}
      </div>
    </div>
  );
};

export default InputLoginComponent;