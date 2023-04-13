import { Box, useMediaQuery } from "@mui/material";
import React from "react";
import {  useSelector, useDispatch } from "react-redux";
import NavBar from "../../components/navbar/NavBar";
import MyChats from "./MyChats";
import SingleChat from "./SingleChat";
import { setError } from "../../redux/features/authSlice";


export default function Home() {
  const dispatch = useDispatch();
  // const user = JSON.parse(localStorage.getItem("profile"));
  const {
    selectedChat,
  } = useSelector((state) => state.chat);
  const { user } = useSelector(
    (state) => state.auth
  );

  const [openDrawer, setOpenDrawer] = React.useState(false);
  const isNonMobile = useMediaQuery("(min-width:640px)");

   React.useEffect(() => {
     if(user?.user?._id){
      dispatch(setError())
     }
   }, []);// eslint-disable-line react-hooks/exhaustive-deps

  //console.log(selectedChat)

  return (
    <div className="w-full h-screen flex flex-col ">
      
       
      <Box>
        <NavBar openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
      </Box>

      <Box
        className={
          isNonMobile
            ? "flex pl-5 h-full"
            : "flex justify-center items-center h-full w-full p-4 overflow-y-hidden"
        }
      >
        {isNonMobile && (
          <>
            <MyChats openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
            <SingleChat />
          </>
        )}

        {!isNonMobile && selectedChat?._id && <SingleChat />}
        {!isNonMobile && !selectedChat?._id && (
          <MyChats openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
        )}
      </Box>
    </div>
  );
}


