import { Box, Modal,Typography, Button } from '@mui/material'
import React from 'react'


export default function ProfilePicModal({handleCloseModal,openModal,user}) {
    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 500,
        height:500,
        bgcolor: "rgb(105,105,105)",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
      };
  return (
    <Modal open={openModal} onClose={handleCloseModal}>
          <Box sx={style} className="flex flex-col items-center rounded-full ">

            <Typography className="mt-3 flex justify-center text-white text-2xl">
              {" "}
              {user?.name || user?.userName}
            </Typography>

            <img
              src={user?.pic}
              alt=""
              className="w-[250px] mt-5 border border-black p-5 rounded-3xl"
            />

            <Typography className="mt-5 text-xl text-white">
              Email: <span>{user?.email}</span>
            </Typography>

            <Box className="mb-1 mt-2">
              <Button variant='contained' className='bg-red-500 hover:bg-red-700' onClick={handleCloseModal}>Close</Button>
            </Box>
          </Box>
        </Modal>
  )
}
