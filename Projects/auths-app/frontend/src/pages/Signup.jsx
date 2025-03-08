import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Password from "../components/Input/Password";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess, signupValidationCheck } from "../utils/utils";

const Signup = () => {
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleInput = (e) => {
    const { name, value } = e.target;
    const signupInfoCopy = { ...signupInfo };
    signupInfoCopy[name] = value;
    setSignupInfo(signupInfoCopy);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (signupValidationCheck(signupInfo)) {
      try {
        const fetchUrl = "http://localhost:8080/auth/signup";
        const response = await fetch(fetchUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(signupInfo),
        });
        const result = await response.json();
        console.log(result);
        const {success,message,error}= result;
        if(success){
          handleSuccess(message);
          setTimeout(() => {
            navigate('/login');
          }, 1000);
        }
        else if(error){
          const {details} = error;
           handleError(details[0].message); 
        }
        else{
           handleError(message);
        }

      } catch (err) {
        handleError(err);
      }
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-96 border rounded-md px-7 py-10 shadow-lg">
        <form onSubmit={handleSignup}>
          <h3 className="text-2xl mb-7">Signup</h3>
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex flex-col  gap-1">
              <label htmlFor="name" className="text-sm text-slate-500">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                onChange={handleInput}
                value={signupInfo.name}
                placeholder="Enter your name"
                className="border outline-none px-2 py-2 rounded text-sm hover:border-slate-400 transition-all ease-linear"
              />
            </div>
            <div className="flex flex-col  gap-1">
              <label htmlFor="email" className="text-sm text-slate-500">
                Email
              </label>
              <input
                type="text"
                name="email"
                id="email"
                value={signupInfo.email}
                onChange={handleInput}
                placeholder="Enter your email"
                className="border outline-none px-2 py-2 rounded text-sm hover:border-slate-400 transition-all ease-linear"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-sm text-slate-500">
                Password
              </label>
              <Password onChange={handleInput} value={signupInfo.password} />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 p-2 rounded text-white my-1 text-center transition-all ease-linear"
          >
            Create Account
          </button>
          <p className="text-sm mt-4 text-center">
            Already have an account?{" "}
            <Link to={"/login"} className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
      {/* <ToastContainer /> */}
    </div>
  );
};

export default Signup;
