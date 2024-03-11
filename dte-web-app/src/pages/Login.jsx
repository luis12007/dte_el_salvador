import React from "react";

import InputLoginComponent from "../components/InputLoginComponent";
export default function Login() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-800">
      <div className="bg-white rounded-lg shadow-lg p-8 mx-8 h-3/5 w-full md:w-2/4">
        {/* Content goes here */}
        <InputLoginComponent></InputLoginComponent>
      </div>
    </div>
  );
}

/* https://react-icons.github.io/react-icons/icons/ai/ */