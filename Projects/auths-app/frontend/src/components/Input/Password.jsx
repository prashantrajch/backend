import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Password = ({onChange,value}) => {
    const [showPass,setShowPass] = useState(false);

    const handleShowPassword = () =>{
        setShowPass(!showPass);
    }

  return (
    <div className="relative">
      <input
        type={showPass ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        name="password"
        id="password"
        placeholder="Enter your password"
        className="w-full border outline-none px-2 py-2 rounded text-sm hover:border-slate-400 transition-all ease-linear"
        
      />
      <div className="absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer">
      {
        showPass ?
        <FaRegEye className="text-blue-500" onClick={handleShowPassword} />
        :
        <FaRegEyeSlash className="text-slate-500" onClick={handleShowPassword} />

      }
      </div>
    </div>
  );
};

export default Password;
