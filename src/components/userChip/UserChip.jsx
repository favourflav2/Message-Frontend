import { Box, Chip, IconButton, Stack, Typography } from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";

export default function UserChip({ item, handleClick }) {
  const {
    user,
    loading: authLoading,
    error: authErr,
    searchedUsers,
  } = useSelector((state) => state.auth);
  const userId = user?.user?._id;
  //console.log(userId,"user")
  //console.log(item.userName.length)
   const handleDelete = () => {
    return handleClick
  };

  return (
    <Stack direction="row" >
      <Chip
        label={item?._id === userId ? "You" : item?.userName}
        onClick={handleClick}
        //onDelete={handleDelete}
        className="text-gray-300 bg-violet-600 chip"
      />
      
     </Stack>
    // <Stack direction="row" spacing={1} className="text-gray-300">
    //   <Chip
    //     label="Custom delete icon"
    //     onDelete={handleClick}
    //     deleteIcon={<CloseIcon className=""/>}
    //   />
      
    // </Stack>

    // <Box className="flex items-center bg-violet-600 chip rounded-full justify-between p-1">

    //   <Typography className="text-sm text-gray-200 p-1 ">
    //     {item?._id === userId ? "You" : item?.userName}
    //   </Typography>

    //   <CloseIcon
    //     className="text-lg text-gray-200 ml-1 cursor-pointer inline"
    //     onClick={handleClick}
    //   />

    // </Box>
  );
}
