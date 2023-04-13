import React from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Modal,
  Stack,
  useMediaQuery,
  Typography,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";

import { searchUser, changeSearchedUsers } from "../../redux/features/authSlice";
import UserSearchCard from "../UserSearchCard/UserSearchCard";
import { toast } from "react-toastify";
import { addToGroupChat, removeFromGroupChat, updateGroupChat } from "../../redux/features/chatSlice";

export default function GroupChatModal({openGroupModal,handleOpenGroupModal,handleCloseGroupModal,users, item}) {

    const { selectedChat, loading:chatLoading } = useSelector((state) => state.chat);
  const { user, loading:authLoading,  searchedUsers } = useSelector(
    (state) => state.auth
  );
    const dispatch = useDispatch();

    const [chatName, setChatName] = React.useState(selectedChat?.chatName);
    const [search, setSearch] = React.useState("");
    //const [selectedUser, setSelectedUser] = React.useState([]);
    const selectedUser = item?.users
    const userId = user?.user?._id
    //console.log(item)

    const isNonMobile = useMediaQuery('(min-width:640px)')

    // React.useEffect(()=>{
    //     setSelectedUser(item?.users)
    // },[item?.users])

    React.useEffect(()=>{
      setChatName(item?.chatName)
    },[item?.chatName])


    //const itemDiv = selectedUser

    // const chatNameUpperCase = selectedChat?.chatName?.split(" ").length > 1 ? selectedChat?.chatName?.split(" ").map(item => item[0] + item.slice(1)).join(" ") : selectedChat?.chatName?.split(" ").map(item => item[0].toUpperCase() + item.slice(1)).join("")

     

    function handleSearch(searchValue){
        setSearch(searchValue)

        if(!searchValue){
            return
        }

        dispatch(searchUser(searchValue))
    }

    function handleGroup(userToAdd){

        for(let i =0; i <= selectedUser.length; i++){
         //console.log(selectedUser[i]?._id)
         if(selectedUser[i]?._id === userToAdd._id){
           return toast.error("User already added")
         }
       }

       if(selectedChat?.groupAdmin._id !== userId){
        return toast.error("Only admins can add someone")
       }
   
       //setSelectedUser([...selectedUser,userToAdd])
       dispatch(addToGroupChat({chatId:selectedChat?._id,userId:userToAdd._id}))
       //dispatch(getAllChats())
   
        setSearch("")
       
        dispatch(changeSearchedUsers())
     }

     function changeGroupChatName(){
      if(chatName){
        dispatch(updateGroupChat({chatName,chatId:selectedChat?._id}))
        //handleCloseGroupModal()
        setChatName(chatName)
        
      }else{
        toast.error("Please change name")
      }
     }

     function handleDelete(item){
      if(selectedChat?.groupAdmin?._id !== userId && item._id !== userId){
       return toast.error("Only admins can remove someone")
      }

      if(userId === item._id){
        if(selectedChat?.users?.length === 1){
          return toast.error("You cant delete no more users")
        }
        if(window.confirm("Are you sure you want to remove yourself from this group chat?")){
           return dispatch(removeFromGroupChat({chatId:selectedChat?._id,userId:item._id}))
        }else{
          return
        }
      }

      if(selectedChat?.users?.length === 1){
        return toast.error("You cant delete no more users")
      }
      dispatch(removeFromGroupChat({chatId:selectedChat?._id,userId:item._id}))
     }

     

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        
      };

      

    
  return (
    <Modal open={openGroupModal} onClose={handleCloseGroupModal}>
        <Box
          sx={style}
          className={isNonMobile ? " min-h-[300px] addGroupChat flex flex-col items-center min-w-[450px]" : " min-h-[300px] addGroupChat flex flex-col items-center w-full"}
        >
          <Box className="absolute right-0 ">
            <IconButton className="text-gray-300" onClick={handleCloseGroupModal}>
              <CloseIcon className="text-base" />
            </IconButton>
          </Box>

          <Box className="pt-3 mt-4 mb-3 border-b border-gray-300">
            <Typography className="text-2xl text-gray-300">
              {item?.chatName}
            </Typography>
          </Box>

          <Stack  className='mt-4 p-1 grid grid-cols-3 items-center gap-3 '>
            {item?.users?.map((value,index)=>(
              <Chip label={value?._id === userId ? "You" : value?.userName} className="text-gray-300 bg-violet-600 chip " key={index} onDelete={()=>handleDelete(value)}/>
            ))}
          </Stack>

          <form className="w-[95%] pt-3 mt-1 flex flex-col text-gray-300">
            <Box className="flex items-center mb-2">
            <input
              type="text"
              className="w-[80%] h-[40px] rounded-xl inputB indent-2 mr-2"
              placeholder="Chat Name"
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
            />
            {chatLoading? (<CircularProgress />): (<Button variant="contained" type="button" className=" bg-violet-600 chip" onClick={changeGroupChatName}>Update</Button>)}
            </Box>

            <input
              type="text"
              className="w-full h-[40px] rounded-xl inputB indent-2 mt-1"
              placeholder="Add Users eg: Favour, James"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </form>
          
          

          <Stack className="overflow-scroll no-scrollbar w-[70%] mt-2 mb-4">
          {authLoading ? <div>loading...</div> : searchedUsers?.slice(0,4).map((item,index)=>(
            <UserSearchCard item={item} key={index} size={1} createChat={()=>handleGroup(item)} />
          ))}
          </Stack>

          <Button variant="contained" className=" bg-red-500 hover:bg-red-800 mb-5 " >Leave Group</Button>
        </Box>
      </Modal>
  )
}
