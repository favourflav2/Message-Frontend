import React from "react";
import {
  Box,
  CircularProgress,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import GroupIcon from "@mui/icons-material/Group";
import ProfilePicModal from "../../components/modals/ProfilePicModal";
import Groups3Icon from "@mui/icons-material/Groups3";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import GroupChatModal from "../../components/modals/GroupChatModal";
import {
  emptySelectedChat,
  getAllMessages,
  sendMessage,
  setNoti,
} from "../../redux/features/chatSlice";

import ScrollChat from "../../components/Scroll/ScrollChat";
import { changeSearchedUsers } from "../../redux/features/authSlice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { socket } from "../../socket";
import Lottie from "lottie-react";
import loadingAnimation from "../../animations/typing.json";

export default function SingleChat() {
  const { selectedChat, setChats, loading,noti } = useSelector(
    (state) => state.chat
  );
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [writeMessage, setWriteMessage] = React.useState("");
  const [typing, setTyping] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);

  // 1 and 1 chat modal
  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  // GroupChat modal
  const [openGroupModal, setOpenGroupModal] = React.useState(false);
  const handleOpenGroupModal = () => setOpenGroupModal(true);
  const handleCloseGroupModal = () => setOpenGroupModal(false);

  const userId = user?.user?._id;
  const chatUser = selectedChat?.users;
  const newArr = setChats?.filter((value) => value._id === selectedChat?._id);

  const isNonMobile = useMediaQuery("(min-width:640px)");

  // Socket state
  const [socketConnect, setSocketConnect] = React.useState(false);
  const [chatCompare, setChatcompare] = React.useState(null);
  const [gas, setGas] = React.useState("");

  function getSender() {
    return chatUser[0]._id === userId
      ? chatUser[1].userName
      : chatUser[0].userName;
  }

  function getSenderUserObj() {
    return chatUser[0]._id === userId ? chatUser[1] : chatUser[0];
  }

  React.useEffect(() => {
    socket.emit("setup", userId);
    socket.on("connected", () => setSocketConnect(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    //console.log(socket.connected)

    socket.on("message recieved", (newMsg) => {
      //! The message state in our redux contains array of messages.. within each message they contain the chat from which they were created
      //* So..... if the selcedChats id doesnt equal the message chat id... that means we dont have the selected chat open.. so we show notifaction
      //if theres no chatCompare = (selectedChat) or the chatCompare/selectedChats id !== the message modal .chat id we show notification
      //console.log(chatCompare?._id, "chatCompare")
      //console.log(newMsg?.chat?._id)
      
      if (!selectedChat || selectedChat?._id !== newMsg?.chat?._id) {
        //give notfication
        //console.log(newMsg,"----------")
        dispatch(setNoti(newMsg))
       
      } else {
        //console.log(newMsg)
        dispatch(getAllMessages({ chatId: selectedChat?._id }));
        //dispatch(setMessages(newMsg))
      }
    });
  }, [ selectedChat?._id, dispatch, userId,selectedChat]);

  // React.useEffect(()=>{
  //   socket.on("message recieved", (newMsg) => {
  //     //! The message state in our redux contains array of messages.. within each message they contain the chat from which they were created
  //     //* So..... if the selcedChats id doesnt equal the message chat id... that means we dont have the selected chat open.. so we show notifaction
  //     //if theres no chatCompare = (selectedChat) or the chatCompare/selectedChats id !== the message modal .chat id we show notification
  //     //console.log(chatCompare?._id, "chatCompare")
  //     //console.log(newMsg?.chat?._id)
  //     console.log(newMsg)
  //     if (!chatCompare || chatCompare?._id !== newMsg?.chat?._id) {
  //       //give notfication
  //       //console.log(newMsg,"----------")

  //     } else {
  //       //console.log(newMsg)
  //       dispatch(getAllMessages({ chatId: selectedChat?._id }));
  //       //dispatch(setMessages(newMsg))
  //     }
  //   });
  // })

  //console.log(socket)

  React.useEffect(() => {
    if (selectedChat?._id) {
      dispatch(getAllMessages({ chatId: selectedChat?._id }));
      socket.emit("join chat", selectedChat?._id);
      setChatcompare(selectedChat);
    }
  }, [selectedChat?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  const userObj = selectedChat?.users?.length >= 2 && getSenderUserObj();
  //console.log(userObj)

  const senderUserName =
    selectedChat?.users?.length >= 2 &&
    getSender()
      .split(" ")
      .map((item) => item[0].toUpperCase() + item.slice(1))
      .join(" ");

  function handleKeySubmit(event) {}

  function handleSubmit() {
    if (writeMessage) {
      dispatch(
        sendMessage({ content: writeMessage, chatId: selectedChat?._id })
      );
      setWriteMessage("");
      socket.emit("stop typing", selectedChat?._id);
      //socket.emit("new message",messages)
    }
  }

  function typingHandler(e) {
    setWriteMessage(e.target.value);

    if (!socket.connected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat?._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;

    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat?._id);
        setTyping(false);
      }
    }, timerLength);
  }

   
 

  return (
    <>
      {selectedChat?._id ? (
        <Box
          className={
            isNonMobile
              ? "flex flex-col h-full w-[60%]"
              : "flex flex-col  w-full h-full"
          }
        >
          <Box
            className={
              isNonMobile
                ? "mt-4 pl-2 ml-2 pb-10 mb-3 flex justify-between items-center pr-2 mr-2"
                : "mt-4 pl-2 ml-2 pb-2 mb-1 flex justify-between items-center pr-2 mr-2"
            }
          >
            {selectedChat?.isGroupChat && selectedChat?.users?.length === 1 ? (
              <Typography className="text-gray-300 text-2xl">{`${selectedChat?.chatName}`}</Typography>
            ) : (
              <Typography className="text-gray-300 text-2xl">
                {!selectedChat?.isGroupChat && `${senderUserName}`}
                {selectedChat?.isGroupChat &&
                  newArr?.map((item, index) => (
                    <span key={index}>
                      {item?.chatName
                        .split(" ")
                        .map((item) => item[0].toUpperCase() + item.slice(1))}
                    </span>
                  ))}
              </Typography>
            )}

            {!selectedChat?.isGroupChat && (
              <IconButton onClick={handleOpenModal}>
                <GroupIcon className="text-gray-300" />
              </IconButton>
            )}
            {selectedChat?.isGroupChat && (
              <IconButton
                onClick={() => {
                  handleOpenGroupModal();
                  dispatch(changeSearchedUsers());
                }}
              >
                <Groups3Icon className="text-gray-300 text-3xl" />
              </IconButton>
            )}
          </Box>

          {!selectedChat?.isGroupChat && (
            <ProfilePicModal
              openModal={openModal}
              user={userObj}
              handleCloseModal={handleCloseModal}
            />
          )}
          {selectedChat?.isGroupChat && (
            <GroupChatModal
              openGroupModal={openGroupModal}
              handleCloseGroupModal={handleCloseGroupModal}
              item={selectedChat}
              users={chatUser}
            />
          )}

          {!isNonMobile && (
            <Box className=" pl-2 ml-2 pr-2 mr-2 pb-10 flex items-center">
              <IconButton onClick={() => dispatch(emptySelectedChat())}>
                <ArrowBackIcon className="text-gray-300" />
              </IconButton>
              <span
                className="text-gray-300 cursor-pointer"
                onClick={() => dispatch(emptySelectedChat())}
              >
                Go Back
              </span>
            </Box>
          )}

          <Box className=" flex flex-col  w-full">
            <Box className="flex justify-center">
              <Typography className="text-gray-300">
                Monday, April 28 at 12:51pm
              </Typography>
            </Box>

            <Box
              className={
                isNonMobile
                  ? " min-h-[550px] max-h-[600px] p-1"
                  : " min-h-[450px] max-h-[460px]"
              }
            >
              <ScrollChat />
            </Box>

            <Box>
              {isTyping ? (
                <Lottie animationData={loadingAnimation} loop={true} className="w-[60px]" />
              ) : (
                <></>
              )}
            </Box>
            <Box className="flex items-center w-full py-4 justify-center mt-12">
              <IconButton>
                <AttachFileIcon className="text-gray-700 text-xl" />
              </IconButton>

              <input
                type="text"
                className=" bg-inherit rounded-3xl indent-2 w-[80%] h-[40px] border border-gray-500 mx-1 text-gray-300"
                placeholder="Write a message..."
                value={writeMessage}
                onChange={(e) => typingHandler(e)}
                onKeyDown={(event) => handleKeySubmit(event)}
              />

              {loading ? (
                <CircularProgress />
              ) : (
                <IconButton onClick={handleSubmit}>
                  <SendIcon className=" text-violet-600 text-xl" />
                </IconButton>
              )}
            </Box>
          </Box>
        </Box>
      ) : (
        <Box className="flex flex-col h-full w-[60%] justify-center items-center">
          {/* Title */}
          <Box className=" absolute top-[50%] nonSelect p-5">
            <Typography className="text-gray-300 text-2xl">
              Select A Chat
            </Typography>
          </Box>
        </Box>
      )}
    </>
  );
}

//  <Box className="flex flex-col h-full w-[60%]">

// <Box className="mt-4 pl-2 ml-2 pb-10 mb-3 flex justify-between items-center pr-2 mr-2">
//   <Typography className="text-gray-300 text-2xl">
//     {!selectedChat?.isGroupChat &&`${senderUserName}`}
//     {selectedChat?.isGroupChat && newArr?.map((item,index)=>(
//       <span key={index}>{item?.chatName.split(" ").map(item => item[0].toUpperCase() + item.slice(1))}</span>
//     ))}
//   </Typography>

//   {!selectedChat?.isGroupChat && <IconButton onClick={handleOpenModal}>
//       <GroupIcon className="text-gray-300"/>
//   </IconButton>}
//   {selectedChat?.isGroupChat && <IconButton onClick={handleOpenGroupModal}>
//       <Groups3Icon className="text-gray-300 text-3xl"/>
//   </IconButton>}
// </Box>

// {!selectedChat?.isGroupChat && <ProfilePicModal openModal={openModal} user={userObj} handleCloseModal={handleCloseModal}/>}
// {selectedChat?.isGroupChat && <GroupChatModal openGroupModal={openGroupModal} handleCloseGroupModal={handleCloseGroupModal} item={selectedChat} users={chatUser}/>}

//  <Box className=" flex flex-col  w-full">

//       <Box className="flex justify-center">
//           <Typography className="text-gray-300">Monday, April 28 at 12:51pm</Typography>
//       </Box>

//       <Box className=" overflow-x-scroll flex flex-col h-[620px] no-scrollbar msg">
//           {data.map((item,index)=>(
//               <Box className="w-[100px]" key={index}>
//                 fav
//               </Box>
//           ))}
//       </Box>

//       <Box className="flex items-center w-full py-4 justify-center mt-12">
//               <IconButton>
//                   <AttachFileIcon className="text-gray-700 text-xl"/>
//               </IconButton>

//               <input
//               type="text"
//               className=" bg-inherit rounded-3xl indent-2 w-[80%] h-[40px] border border-gray-500 mx-1"
//               placeholder="Write a message..."
//               />

//               <IconButton>
//                   <SendIcon className=" text-violet-600 text-xl"/>
//               </IconButton>
//       </Box>

//  </Box>

// </Box>
