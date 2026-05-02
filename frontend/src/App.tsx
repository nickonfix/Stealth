import React, { useEffect } from 'react';
import { Outlet } from 'react-router';
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';
import { UserProvider, useAuth } from './Context/useAuth';

const ScrollLock = () => {
  const { isLoggedIn } = useAuth();
  const loggedIn = isLoggedIn();
  
  useEffect(() => {
    if (!loggedIn) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    }
  }, [loggedIn]);

  return null;
};

function App() {
  return (
    <UserProvider>
      <ScrollLock />
      <Navbar />
      <Outlet />
      <ToastContainer />
    </UserProvider> 
  );
}

export default App;
