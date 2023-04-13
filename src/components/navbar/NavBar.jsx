import {
  Box,
  Button,
  IconButton,
  Typography,
  Badge,
  MenuItem,
  Menu,
  Modal,
  Drawer,
  MenuList,
  ListItemIcon,
  ListItemText,
  Avatar,
} from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changeSearchedUsers,
  searchUser,
  setError,
  setLogOut,
} from "../../redux/features/authSlice";
import MessageIcon from "@mui/icons-material/Message";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import jwt_decode from "jwt-decode";
import ChatLoading from "../loading/ChatLoading";
import UserSearchCard from "../UserSearchCard/UserSearchCard";
import { changeChats, changeSelectedChat, deleteNoti, deleteNotiOnSelectedChat, getChats } from "../../redux/features/chatSlice";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from '@mui/icons-material/Logout';

export default function NavBar({ setOpenDrawer, openDrawer }) {
  const dispatch = useDispatch();
  const { user, loading, error, searchedUsers } = useSelector(
    (state) => state.auth
  );
  const { selectedChat, setChats, noti } = useSelector((state) => state.chat);
  const [search, setSearch] = React.useState("");
  const token = user?.token;
  const userId = user?.user?._id

  if (token?.length > 55) {
    const decode = jwt_decode(token);
    if (decode.exp * 1000 < new Date().getTime()) {
      dispatch(setLogOut());
    }
  }

  // Desktop Menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Desktop Noti Menu
  const [anchorElNoti, setAnchorElNoti] = React.useState(null);
  const openNoti = Boolean(anchorElNoti);
  const handleClickNoti = (event) => {
    setAnchorElNoti(event.currentTarget);
  };
  const handleCloseNoti = () => {
    setAnchorElNoti(null);
  };

  // Mobile Menu
  const [anchorElMobile, setAnchorElMobile] = React.useState(null);
  const openMobile = Boolean(anchorElMobile);
  const handleClickMobile = (event) => {
    //console.log(event.currentTarget)
    setAnchorElMobile(event.currentTarget);
  };
  const handleCloseMobile = () => {
    setAnchorElMobile(null);
  };

  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  //const [openDrawer, setOpenDrawer] = React.useState(false);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "rgb(105,105,105)",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  function getSender(item) {
    return item?.chat?.users[0]._id === userId
      ? item?.chat?.users[1].userName
      : item?.chat?.users[0].userName;
   
  }

  function handleSearch() {
    if (!search) {
      toast.error("Search field cannot be empty");
    } else {
      dispatch(setError());
      dispatch(searchUser(search));
    }
  }

  function accessChat(userId) {
    dispatch(getChats(userId));
  }

  React.useEffect(() => {
    error && toast.error(error);
  }, [error]);

  React.useEffect(() => {
    if (selectedChat?._id) {
      dispatch(changeChats([selectedChat]));

      if (!setChats.find((c) => c._id === selectedChat._id)) {
        dispatch(changeChats([selectedChat, ...setChats]));
      } else {
        dispatch(changeChats([...setChats]));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]);

   React.useEffect(()=>{
    const arr = noti?.findIndex(value => value?.chat?._id === selectedChat?._id)
    if(arr !== -1){
      dispatch(deleteNotiOnSelectedChat(selectedChat))
    }
   },[noti,selectedChat,dispatch])
 

  

  return (
    <Box className=" bg-inherit h-[80px] w-full border-b border-gray-700 flex justify-between items-center">
      {/* left side */}
      <Box className="flex items-center ml-5">
        <IconButton className="mr-2">
          <MessageIcon className=" text-violet-500" />
        </IconButton>
        <Typography className="text-white">Messaging</Typography>
      </Box>

      {/* right Side */}
      <Box className="sm:flex hidden items-center">
        <Box className="flex inputB items-center mr-1">
          <input
            type="text"
            //value={search}
            className=" bg-inherit rounded-l-[24px] h-[30px] indent-2 text-white"
            //placeholder="Search User"
            //onChange={(e) => setSearch(e.target.value)}
          />
          <SearchIcon
            className="text-white mx-1"
            onClick={() => {
              setOpenDrawer(true);
              dispatch(changeSearchedUsers())
              setSearch("")
            }}
          />
        </Box>

        {/* Drawer */}
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
                    value={search}
                    className=" inputB rounded-l-[24px] h-[30px] indent-2 text-white w-[75%]"
                    placeholder="Search User"
                    onChange={(e) => setSearch(e.target.value)}
                  />

                  <Button
                    variant="contained"
                    className="btn h-[30px] ml-2 w-[20px]"
                    onClick={() => {
                      handleSearch();
                    }}
                  >
                    Go
                  </Button>
                </Box>

                {/* loading */}
                {loading && <ChatLoading />}

                <Box>
                  {/* mapped data */}
                  {searchedUsers?.map((item, index) => (
                    <UserSearchCard
                      item={item}
                      key={index}
                      size={2}
                      createChat={() => {
                        accessChat({ userId: item?._id });
                        setOpenDrawer(false);
                        
                      }}
                    />
                    
                  ))}
                </Box>
              </Box>
            </Drawer>
          </React.Fragment>
        </Box>

        <Badge
          badgeContent={noti?.length}
          color="secondary"
          className="mr-4"
          sx={{
            "& .MuiBadge-badge": {
              right: 8,
              top: 8,
              padding: "0 4px",
              height: "16px",
              minWidth: "13px",
              backgroundColor: "rgb(109 40 217)",
            },
          }}
        >
          <IconButton onClick={handleClickNoti}>
            <NotificationsIcon className="text-white" />
          </IconButton>
        </Badge>

        {/* DropDown for notifactions */}
        <Menu
         anchorEl={anchorElNoti}
         open={openNoti}
         onClose={handleCloseNoti}
        >
         {noti?.length === 0 && <MenuIcon onClick={handleCloseNoti}>No New Messages</MenuIcon>}
         {noti?.map((item,index) => (
          <MenuItem key={index} onClick={()=>{
            dispatch(changeSelectedChat(item?.chat))
            handleCloseNoti()
            dispatch(deleteNoti(item))
          }}>
            {item?.chat?.isGroupChat ? `New Message in ${item?.chat?.chatName}` : `New Message from ${getSender(item)}`}
          </MenuItem>
         ))}
        
        </Menu>

        <img
          src={user?.user?.pic}
          alt=""
          className="h-[25px] bg-white rounded-[50%]"
          onClick={handleOpenModal}
        />

        <Modal open={openModal} onClose={handleCloseModal}>
          <Box sx={style} className="flex flex-col items-center">
            <Box className="mb-3">
              <IconButton
                className=" absolute right-3 top-3"
                onClick={handleCloseModal}
              >
                <CloseIcon className="text-white" />
              </IconButton>
            </Box>

            <Typography className="mt-3 flex justify-center text-white text-2xl">
              {" "}
              {user?.user?.name || user?.user?.userName}
            </Typography>

            <img
              src={user?.user?.pic}
              alt=""
              className="w-[250px] mt-5 border border-black p-5 rounded-3xl"
            />

            <Typography className="mt-5 text-xl text-white">
              Email: <span>{user?.user?.email}</span>
            </Typography>
          </Box>
        </Modal>

        <IconButton
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <KeyboardArrowDownIcon className="text-white" />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          id="basic-menu"
        >
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>My account</MenuItem>
          <MenuItem
            onClick={() => {
              handleClose();
              dispatch(setLogOut());
              
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      </Box>

      {/* mobile side */}
      <Box className="sm:hidden flex items-center">
        <IconButton onClick={handleClickMobile}>
          <MenuIcon className="text-gray-300" />
        </IconButton>
      </Box>

      <Menu
        anchorEl={anchorElMobile}
        open={openMobile}
        onClose={handleCloseMobile}
        className=""
      >
        <MenuList className="">

        {/* Profile */}
        <MenuItem onClick={()=>{
          handleOpenModal()
          handleCloseMobile()
        }}>
            <ListItemIcon>
              <Avatar alt="Profile Pic" src={user?.user?.pic} className="w-[26px] h-[26px]"/>
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>

            {/* Notifcations */}
          <MenuItem onClick={()=>{
            handleCloseMobile()
          }}>
            <ListItemIcon>
              <Badge
                badgeContent={noti?.length}
                color="secondary"
                sx={{
                  "& .MuiBadge-badge": {
                    right: 5,
                    top: 5,
                    padding: "0 4px",
                    height: "12px",
                    minWidth: "13px",
                    backgroundColor: "rgb(109 40 217)",
                  },
                }}
              >
                
                  <NotificationsIcon className="text-gray-300" />
                
              </Badge>
            </ListItemIcon>
            <ListItemText>Messages</ListItemText>
          </MenuItem>

          <MenuItem onClick={()=>{
            handleCloseMobile()
            dispatch(setLogOut());
            //navigate("/login");
          }}>
            <ListItemIcon>
              <LogoutIcon className="text-gray-300"/>
            </ListItemIcon>
            <ListItemText>Log Out</ListItemText>
          </MenuItem>

        </MenuList>
      </Menu>
    </Box>
  );
}
