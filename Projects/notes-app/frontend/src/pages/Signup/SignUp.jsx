import React, { useState } from "react";
import PasswordInput from "../../components/Input/PasswordInput/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstace from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar/Navbar";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp =  async (e) => {
    e.preventDefault();
    if(!name){
      setError("Please enter your name");
      return;
    }
    if(!validateEmail(email)){
      setError("Please enter a valid email address");
      return
    }
    if(!password){
      setError("Please enter the password");
      return
    }

    setError('');

    //SignUp API Call
        try{
          const response = await axiosInstace.post('/signUp', {
            fullName: name,
            email: email,
            password: password,
          });
    
          // Handle successful registration response
          if(response.data && response.data.error){
            setError(response.data.message);
            return;
          }

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
    <div className="flex justify-center items-center mt-28">
      <div className="w-96 border px-7 py-10 bg-white rounded">
        <form action="" onSubmit={handleSignUp}>
          <h4 className="text-2xl mb-7">SignUp</h4>
          <input
            type="text"
            placeholder="Name"
            className="input-box"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Email"
            className="input-box"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={"Create password"}
          />

          {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
          <button type="submit" className="btn-primary">
            Create Account
          </button>
          <p className="text-sm text-center mt-4">
            Already have an account?
            <Link to={"/login"} className="font-medium text-primary underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
    </>
  );
}
