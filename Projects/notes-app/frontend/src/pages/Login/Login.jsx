import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/Input/PasswordInput/PasswordInput";
import { validateEmail } from "../../utils/helper";
import axiosInstace from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar/Navbar";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) {
        setError("Please enter a valid email address.");
      return;
    }
    if (!formData.password) {
      setError("Please enter the password");
      return;
    }
    setError("");

    //Login api call
    try{
      const response = await axiosInstace.post('/login', {
        email: formData.email,
        password: formData.password,
      });

      // Handle successful login response
      if(response.data && response.data.accessToken){
        localStorage.setItem("token", response.data.accessToken);
        navigate('/dashboard');
      }

    }catch(err){
      // Handle Login Error
      if(err.response && err.response.data && err.response.data.message){
        setError(err.response.data.message);
      }
      else{
        setError('An unexpectd error occured. Please try agin')
      }
    }
  };

  return (
    <>
    <Navbar />
    <div className="mt-28 flex items-center justify-center">
      <div className="w-96 border bg-white px-7 py-10">
        <form action="" onSubmit={handleLogin}>
          <h4 className="text-2xl mb-7">Login</h4>

          <input
            type="text"
            className="input-box"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => {
              setFormData((prev) => {
                return { ...prev, email: e.target.value };
              });
            }}
          />
          <PasswordInput
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => {
                return { ...prev, password: e.target.value };
              })
            }
          />
          {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
          <button type="submit" className="btn-primary">
            Login
          </button>
          <p className="text-sm text-center mt-4">
            Not registered yet?{" "}
            <Link to={"/signup"} className="font-medium text-primary underline">
              Create an Account
            </Link>
          </p>
        </form>
      </div>
    </div>
    </>
  );
}
