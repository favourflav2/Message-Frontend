import React from "react";
import { Box,  Typography } from "@mui/material";
import {  useSelector } from "react-redux";


export default function ChatCard({ item,handleClick }) {

    //if(item._id)
    const { selectedChat } = useSelector((state) => state.chat);
    //const dispatch = useDispatch()
    const { user } = useSelector(
        (state) => state.auth
      );
    const userId = user?.user?._id
    const chatUser = item?.users

    //console.log(item)
    

     function getSender(){
         return chatUser[0]._id === userId ? chatUser[1].userName : chatUser[0].userName
     }
    

  return (
    <Box className={selectedChat._id === item._id ? "w-[99%] h-[80px] flex flex-col cursor-pointer items-center chatCard" : "w-[99%] cursor-pointer h-[80px] flex flex-col  items-center "} onClick={handleClick}>
      <Box className="w-[95%] h-full flex flex-col justify-center ">
        <Box className="flex flex-col">
            {/* Chatname */}
          <Typography className="text-gray-100 text-[18px]">
            {item?.isGroupChat && item?.chatName}
            {!item?.isGroupChat && getSender()}
          </Typography>

            {/* Message */}
          <Box className="flex justify-between">

            <Typography className="text-gray-600 ml-2 text-[15px]">
              Luara: <span>Hey!</span>
            </Typography>

            <span className="text-gray-600 text-[15px]">2h</span>

          </Box>
        </Box>
      </Box>
    </Box>
  );
}
