import React from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Modal,
  Stack,
  Drawer,
  Typography,
  useMediaQuery
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import {
  changeSelectedChat,
  createGroupChat,
  getAllChats,
  getChats,
} from "../../redux/features/chatSlice";
import ChatLoading from "../../components/loading/ChatLoading";
import ChatCard from "../../components/chatCard/ChatCard";
import CloseIcon from "@mui/icons-material/Close";
import { changeSearchedUsers, searchUser, setError } from "../../redux/features/authSlice";
import { toast } from "react-toastify";
import UserSearchCard from "../../components/UserSearchCard/UserSearchCard"



export default function MyChats({setOpenDrawer,openDrawer}) {
  const {  loading:chatLoading, setChats,error:chatErr } = useSelector((state) => state.chat);
  const {  loading:authLoading, error:authErr, searchedUsers } = useSelector(
    (state) => state.auth
  );
  //const userId = user?.user?._id;
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  //console.log(setChats)

  const [chatName, setChatName] = React.useState("");
  const [selectedUser, setSelectedUser] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [userSearch, setUserSearch] = React.useState("")

  const isNonMobile = useMediaQuery('(min-width:640px)')
  
  //const [searchResult, setSearchResult] = React.useState([]);

  React.useEffect(() => {
    dispatch(getAllChats());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 450,
  };

  function handleSearch(searchValue) {
    setSearch(searchValue)
    if(!searchValue){
      return;
    }

    dispatch(searchUser(searchValue))
    //setSearchResult(searchedUsers)

  }

  function handleSearchUserModal(){
    if(userSearch){
      dispatch(setError())
      dispatch(searchUser(userSearch))
    }
  }

   function handleGroup(userToAdd){

     for(let i =0; i <= selectedUser.length; i++){
      //console.log(selectedUser[i]?._id)
      if(selectedUser[i]?._id === userToAdd._id){
        return toast.error("User already added")
      }
    }

    setSelectedUser([...selectedUser,userToAdd])

     setSearch("")
    
     dispatch(changeSearchedUsers())
  }

  function handleDelete(user){
    setSelectedUser(selectedUser.filter(item => item._id !== user._id))
  }

  function handleSubmit(){
    if( chatName && selectedUser.length >= 2){
      dispatch(createGroupChat({users:selectedUser?.map(item => item._id),name:chatName,toast}))

      handleClose()
    }
  }

  function accessChat(userId) {
    dispatch(getChats(userId));
  }

  React.useEffect(()=>{
    chatErr && toast.error(chatErr)
    authErr && toast.error(authErr)
  },[chatErr,authErr])

  

  
//console.log(search)
 

  return (
    <Box className={isNonMobile ? "h-full w-[40%] flex flex-col  border-r border-gray-700": "h-full w-screen flex flex-col"}>
      {/* TItle */}
      <Box className="flex justify-between items-center mt-2">
        <Typography className="text-gray-300 text-xl">Chats</Typography>

        <Box className="flex">
          <IconButton className=" cursor-pointer" onClick={()=>setOpenDrawer(true)}>
            <SearchIcon className="text-gray-600 text-2xl cursor-pointer" />
          </IconButton>

          <IconButton onClick={()=>{
            handleOpen()
            dispatch(changeSearchedUsers())
            setSearch("")
          }}>
            <AddIcon className="text-violet-500 text-2xl" />
          </IconButton>
        </Box>
      </Box>

      {/* Create Group Chat Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={style}
          className=" min-h-[300px] addGroupChat flex flex-col items-center"
        >
          <Box className="absolute right-0 ">
            <IconButton className="text-gray-300" onClick={handleClose}>
              <CloseIcon className="text-base" />
            </IconButton>
          </Box>

          <Box className="pt-3 mt-4">
            <Typography className="text-2xl text-gray-300">
              Create Group Chat
            </Typography>
          </Box>

          <form className="w-[95%] pt-3 mt-5 flex flex-col text-gray-300">
            <input
              type="text"
              className="w-full h-[40px] rounded-xl inputB indent-2 mb-2"
              placeholder="Chat Name"
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
            />

            <input
              type="text"
              className="w-full h-[40px] rounded-xl inputB indent-2 mt-1"
              placeholder="Add Users eg: Favour, James"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </form>
          
          <Stack direction="row" spacing={1} className='mt-2'>
            {selectedUser?.map((item,index)=>(
              // <UserChip item={item} key={index} handleClick={()=>handleDelete(item)}/>
              <Chip label={item?.userName} onDelete={()=> handleDelete(item)} className="text-gray-300 bg-violet-600 chip" key={index}/>
            ))}
          </Stack>

          <Stack className="overflow-scroll no-scrollbar w-[70%] mt-2 mb-4">
          {authLoading ? <div>loading...</div> : searchedUsers?.slice(0,4).map((item,index)=>(
            <UserSearchCard item={item} key={index} size={1} createChat={()=>handleGroup(item)} />
          ))}
          </Stack>

          <Button variant="contained" className=" bg-violet-600 chip mb-5 " onClick={()=>handleSubmit()}>Create Chat</Button>
        </Box>
      </Modal>

      {/* Search User Modal */}
      <Box>
          <React.Fragment>
            <Drawer
              anchor="left"
              open={openDrawer}
              onClose={() => setOpenDrawer(false)}
            >
              <Box className="flex flex-col p-5 gradientBG h-screen border-r border-gray-500 shadow-2xl w-[320px]">
                <Box className="flex  items-center mb-5 mt-3">
                  <input
                    type="text"
                    value={userSearch}
                    className=" inputB rounded-l-[24px] h-[30px] indent-2 text-white w-[75%]"
                    placeholder="Search User"
                    onChange={(e) => setUserSearch(e.target.value)}
                  />

                  <Button
                    variant="contained"
                    className="btn h-[30px] ml-2 w-[20px]"
                    onClick={() => {
                      handleSearchUserModal();
                    }}
                  >
                    Go
                  </Button>
                </Box>

                {/* loading */}
                {authLoading && <ChatLoading />}

                <Box>
                  {/* mapped data */}
                  {searchedUsers?.map((item, index) => (
                    <UserSearchCard
                      item={item}
                      key={index}
                      size={2}
                        createChat={() => {
                          accessChat({userId:item?._id})
                          setOpenDrawer(false)
                        }}
                    />
                  ))}
                </Box>
              </Box>
            </Drawer>
          </React.Fragment>
        </Box>


      {/* Chats Card */}
      <Box className="pt-3 mt-3 overflow-auto">
        {!chatLoading ? (
          setChats?.map((item, index) => (
            <ChatCard
              item={item}
              handleClick={() => dispatch(changeSelectedChat(item))}
              key={index}
            />
          ))
        ) : (
          <ChatLoading />
        )}
      </Box>

    </Box>
  );
}
