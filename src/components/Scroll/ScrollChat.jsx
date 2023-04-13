import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {  useSelector } from "react-redux";
import { Avatar, Box, Tooltip, Typography } from "@mui/material";
import { toast } from "react-toastify";

export default function ScrollChat() {
  const {  messages, error } = useSelector(
    (state) => state.chat
  );
  const {
    user,
  } = useSelector((state) => state.auth);
  const userId = user?.user?._id;

  function isSameSender(messageArray, currentMessage, index, loggedUserId) {
    //if the index of the message is less than the length - 1 we stop and do nothing

    // if we are on the last message the index will equal the message.length - 1 and we will also do nothing

    //* if the next message in the array !== the currentMessage or undefined we countinue

    //TODO lastly we are only going to return true if the message[i] the last message we loop over doesnt equal userId

    //! Knowing this we will be able to add the profile picture to the last message the other user sends
    return (
      index < messageArray.length - 1 &&
      (messageArray[index + 1].sender?._id !== currentMessage?.sender?._id ||
        messageArray[index + 1].sender?._id === undefined) &&
      messageArray[index].sender?._id !== loggedUserId
    );
  }

  function isLastMessage(messageArray, index, loggedUserId) {
    return (
      index === messageArray.length - 1 &&
      messageArray[messageArray.length - 1].sender?._id !== loggedUserId &&
      messageArray[messageArray.length - 1].sender?._id
    );
  }

  
  React.useEffect(()=>{
    if(error){
      toast.error(error)
    }
  },[error])

  
  return (
    <ScrollableFeed>
      {messages &&
        messages?.map((item, index) => (
          <Box key={index}>

            {item.sender._id === userId ? 

            (
              <Box className="flex items-center justify-end">
                {(isSameSender(messages, item, index, userId) ||
                  isLastMessage(messages, index, userId)) && (
                  <Tooltip title={item?.sender?.userName}>
                    <Avatar
                      src={item?.sender?.pic}
                      className=" cursor-pointer"
                    />
                  </Tooltip>
                )}

                <Typography className="bg-violet-600 p-2 rounded-full my-[2px] mr-2 text-gray-300">
                  {item?.content}
                </Typography>
              </Box>
            ) 
            : 
            (
              <Box key={index} className="flex items-center">
                {(isSameSender(messages, item, index, userId) ||
                  isLastMessage(messages, index, userId)) && (
                  <Tooltip title={item?.sender?.userName}>
                    <Avatar
                      src={item?.sender?.pic}
                      className=" cursor-pointer ml-2 mb-10"
                    />
                  </Tooltip>
                )}

                {(isSameSender(messages, item, index, userId) ||
                  isLastMessage(messages, index, userId)) ? (
                    <Typography className="otherMsg p-2 rounded-full my-[2px] ml-1 mb-10 text-gray-300">{item?.content}</Typography>
                ) : (<Typography className="otherMsg p-2 rounded-full my-[2px] ml-[51px] text-gray-300">{item?.content}</Typography>)}

                
              </Box>
            )}
          </Box>
          
        ))}
    </ScrollableFeed>
  );
}
