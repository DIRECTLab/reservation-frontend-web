import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Reserve from './pages/Reserve'
import Settings from './pages/Settings'
import NavigationBar from './components/NavigationBar';
import { useState } from 'react';
import useToken from './hooks/useToken';
import ErrorPage from './pages/ErrorPage';


function App() {

  const { token, setToken } = useToken();
  if (!token && window.location.pathname === "/register") {
    return <Register setToken={setToken} />
  }
  else if (!token) {
    if (window.location.pathname !== "/") {
      window.location.pathname = "/"
    }
    return <Login setToken={setToken} />
  }

  return (
    <BrowserRouter>
      <NavigationBar />
      <Routes>
        <Route exact path='/' element={<Home token={token} />} />
        <Route exact path='/reserve' element={<Reserve token={token}/>} />
        <Route exact path='/settings' element={<Settings token={token} setToken={setToken}/>} />
        <Route path='*' element={<ErrorPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
