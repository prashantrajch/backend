import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Password from "../components/Input/Password";
import { ToastContainer } from "react-toastify";
import {
  handleError,
  handleSuccess,
  loginValidationCheck,
} from "../utils/utils";

const Login = () => {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleInput = (e) => {
    const { name, value } = e.target;
    const copyLoginInfo = { ...loginInfo };
    copyLoginInfo[name] = value;
    setLoginInfo(copyLoginInfo);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loginValidationCheck(loginInfo)) {
      try {
        const url = "http://localhost:8080/auth/login";
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginInfo),
        });
        const result = await response.json();
        
        const { success, error, message, jwtToken, name } = result;
        if (success) {
          handleSuccess(message);
          localStorage.setItem("token", jwtToken);
          localStorage.setItem("user", name);
          setTimeout(() => {
            navigate('/home');
          }, 1000);
        } else if (error) {
          const { details } = error;
          handleError(details[0].message);
        } else {
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
        <form onSubmit={handleLogin}>
          <h3 className="text-2xl mb-7">Login</h3>
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex flex-col  gap-1">
              <label htmlFor="email" className="text-sm text-slate-500">
                Email
              </label>
              <input
                type="text"
                name="email"
                id="email"
                value={loginInfo.email}
                onChange={handleInput}
                placeholder="Enter your email"
                className="border outline-none px-2 py-2 rounded text-sm hover:border-slate-400 transition-all ease-linear"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-sm text-slate-500">
                Password
              </label>
              <Password onChange={handleInput} value={loginInfo.password} />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 p-2 rounded text-white my-1 text-center transition-all ease-linear"
          >
            Login
          </button>
          <p className="text-sm mt-4 text-center">
            Not registered yet?{" "}
            <Link to={"/signup"} className="text-blue-500 hover:underline">
              Create an Account
            </Link>
          </p>
        </form>
      </div>
      {/* <ToastContainer /> */}
    </div>
  );
};

export default Login;
