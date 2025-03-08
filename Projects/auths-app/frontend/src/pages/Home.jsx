import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../utils/utils";
import { ToastContainer } from "react-toastify";

const Home = ({setIsAuthenticated}) => {
  const [user, setUser] = useState("");
  const [productData, setProductData] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    setUser(localStorage.getItem("user"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    handleSuccess("User Loggedout");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const fetchProducts = async () => {
    try {
      const url = "http://localhost:8080/product";
      const header = {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      };
      const response = await fetch(url, header);
      const result = await response.json();
      if(result.success){
        setProductData(result.data);
      }
      else{
        handleError(result.message);
        localStorage.clear();
        setIsAuthenticated(false);
      }
    } catch (err) {
      handleError(err);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <h1>{user} </h1>
      <button onClick={handleLogout}>Logout</button>
      <ul>
        {productData.length !== 0 &&
          productData.map((item, ind) => (
            <li key={ind}>
              <span>Brand:- {item?.name}</span>
              <span>Price:- {item?.price}</span>
            </li>
          ))}
      </ul>
      {/* <ToastContainer /> */}
    </div>
  );
};

export default Home;
