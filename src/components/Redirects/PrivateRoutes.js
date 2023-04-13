import React from 'react'
import { useSelector } from "react-redux";
import LoadingRedirect from './LoadingRedirect';

export default function PrivateRoutes({children}) {
    const { user } = useSelector(
        (state) => state.auth
      );
  return user?.user?._id ? children : <LoadingRedirect str={"/login"}/>
}
