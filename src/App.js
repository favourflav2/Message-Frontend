import React from 'react'
import { Route, Routes } from "react-router-dom";
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import PrivateRoutes from './components/Redirects/PrivateRoutes';
import { useDispatch } from "react-redux";
import { setUser } from './redux/features/authSlice';
import AuthPrivateRoutes from './components/Redirects/AuthPrivateRoutes';
function App() {
  const dispatch = useDispatch()
  const user = JSON.parse(localStorage.getItem("profile"));
 
  
 
  React.useEffect(() => {
    dispatch(setUser(user));
  }, [dispatch, user]);

 

  
  return (
    <div className="">
      <Routes>
        <Route path='/' element={<PrivateRoutes><Home /></PrivateRoutes>}></Route>
        <Route path='/login' element={ <AuthPrivateRoutes><Login /></AuthPrivateRoutes> }></Route>
        <Route path='/signup' element={ <AuthPrivateRoutes><SignUp /></AuthPrivateRoutes> }></Route>
      </Routes>
    </div>
  );
}

export default App;
