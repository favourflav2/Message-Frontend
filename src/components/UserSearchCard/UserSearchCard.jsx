import { Avatar, Box, Stack, Typography } from "@mui/material";
import React from "react";

export default function UserSearchCard({ item,createChat,size }) {

    const names = item?.userName
    const otherNames = item?.name

    const upperCaseOtherNames = otherNames?.split(" ").map(item => item[0].toUpperCase() + item.slice(1)).join(" ")
    const upperCaseNames = names?.split(" ").map(item => item[0].toUpperCase() + item.slice(1)).join(" ")
    
    
  return (
    <Box className={size > 1 ? `w-full h-[70px] userSearchCard my-2 cursor-pointer` : `w-full h-[70px] userSearchCard my-1 cursor-pointer`} onClick={()=>{
      createChat()
      
    }}>
      <Box className="flex h-full">
        {/* Image */}
        <Stack direction="row" spacing={2} className="p-1 flex items-center">
          <Avatar alt="Profile Pic" src={item?.pic} className='rounded-[50%] border border-gray-700'/>
        </Stack>
        {/* Name */}
        <Box className="flex items-center">
          <Box className="flex flex-col ml-1 text-gray-300">
            <Typography className="text-sm ">
              {upperCaseNames || upperCaseOtherNames}
            </Typography>

            <Typography className="text-sm">
              Email: <span>{item?.email}</span>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
