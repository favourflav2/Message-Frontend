import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { add_To_Group_Chat, create_Group_Chat, get_All_Chats, get_All_Messages, get_Chats, remove_From_Group, send_Message, update_Group_Chat } from "../api";
import { socket } from "../../socket";

export const getChats = createAsyncThunk(
  "getChats",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await get_Chats(userId);
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response.data.msg);
    }
  }
);

export const updatedGetChats = createAsyncThunk(
    "updatedGetChats",
    async (userId, { rejectWithValue }) => {
      try {
        const res = await get_Chats(userId);
        console.log(res.data)
        return res.data;
      } catch (e) {
        return rejectWithValue(e.response.data.msg);
      }
    }
  );

  export const getAllChats = createAsyncThunk(
    "getAllChats",
    async (_, { rejectWithValue }) => {
      try {
        const res = await get_All_Chats();
        
        return res.data;
      } catch (e) {
        return rejectWithValue(e.response.data.msg);
      }
    }
  );

  export const createGroupChat = createAsyncThunk(
    "createGroup",
    async ({users,name,toast}, { rejectWithValue }) => {
      try {
        const res = await create_Group_Chat({users,name});
        toast.success("Successfully created group chat")
        return res.data;
      } catch (e) {
        return rejectWithValue(e.response.data.msg);
      }
    }
  );


  export const updateGroupChat = createAsyncThunk(
    "update",
    async ({chatName, chatId}, { rejectWithValue }) => {
      try {
        const res = await update_Group_Chat({chatId,chatName});
        //toast.success("Successfully updated group chat")
        
        return res.data;
      } catch (e) {
        return rejectWithValue(e.response.data.msg);
      }
    }
  );


  export const addToGroupChat = createAsyncThunk(
    "addTo",
    async ({userId, chatId}, { rejectWithValue }) => {
      try {
        const res = await add_To_Group_Chat({chatId,userId});
        //toast.success("Successfully updated group chat")
        
        return res.data;
      } catch (e) {
        return rejectWithValue(e.response.data.msg);
      }
    }
  );


  export const removeFromGroupChat = createAsyncThunk(
    "removeFrom",
    async ({userId, chatId}, { rejectWithValue }) => {
      try {
        const res = await remove_From_Group({chatId,userId});
        //toast.success("Successfully updated group chat")
        
        return res.data;
      } catch (e) {
        return rejectWithValue(e.response.data.msg);
      }
    }
  );

  export const getAllMessages = createAsyncThunk(
    "getMessages",
    async ({chatId}, { rejectWithValue }) => {
      try{
        const res = await get_All_Messages(chatId)

        return res.data

      }catch(e){
        return rejectWithValue(e.response.data.msg);
      }
    }
  )

  export const sendMessage = createAsyncThunk(
    "sendMsg",
    async ({chatId,content}, { rejectWithValue }) => {
      try{
        const res = await send_Message({chatId,content})
        socket.emit("new message",res.data)
        return res.data

      }catch(e){
        return rejectWithValue(e.response.data.msg);
      }
    }
  )

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    selectedChat: [],
    setChats:[],
    messages:[],
    singleMsg:[],
    noti:[],
    error: "",
    loading: false,
  },
  reducers: {
    changeChats: (state,action) =>{
       state.setChats = action.payload
    },
    changeSelectedChat:(state,action)=>{
       state.selectedChat = action.payload
    },
    emptySelectedChat:(state) => {
      state.selectedChat = []
    },
    setMessages: (state,action) => {
      //console.log(action.payload)
      state.messages = [...state.messages,action.payload]
    },
    setNoti:(state,action) =>{
      const index = state.noti.findIndex(value => value._id === action.payload._id)
      if(index === -1){
        state.noti = [action.payload, ...state.noti]
      }
    },
    deleteNoti : (state,action) =>{
      state.noti = state.noti.filter(value => value._id !== action.payload._id)
    }
  },
  extraReducers: (builder) => {
    builder

    .addCase(getChats.pending, (state) => {
        state.loading = true;
      })
      .addCase(getChats.fulfilled, (state, action) => {
        // console.log(action);
        state.loading = false;
        state.selectedChat = action.payload
        
      })
      .addCase(getChats.rejected, (state, action) => {
        //console.log(action);
        state.loading = false;
        state.error = action.payload
      })


      .addCase(getAllChats.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllChats.fulfilled, (state, action) => {
        // console.log(action);
        state.loading = false;
        state.setChats = action.payload
        
      })
      .addCase(getAllChats.rejected, (state, action) => {
        //console.log(action);
        state.loading = false;
        state.error = action.payload
      })


      .addCase(createGroupChat.pending, (state) => {
        state.loading = true;
      })
      .addCase(createGroupChat.fulfilled, (state, action) => {
        // console.log(action);
        state.loading = false;
        state.setChats = [action.payload,...state.setChats]
        
      })
      .addCase(createGroupChat.rejected, (state, action) => {
        //console.log(action);
        state.loading = false;
        state.error = action.payload
      })


      .addCase(updateGroupChat.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateGroupChat.fulfilled, (state, action) => {
        // console.log(action);
        state.loading = false;
        state.selectedChat = action.payload
         const index = state.setChats.findIndex(value => value._id === action.payload._id)

         state.setChats[index] = action.payload
      })
      .addCase(updateGroupChat.rejected, (state, action) => {
        //console.log(action);
        state.loading = false;
        state.error = action.payload
      })



      .addCase(addToGroupChat.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToGroupChat.fulfilled, (state, action) => {
        // console.log(action);
        state.loading = false;
        state.selectedChat = action.payload

        const index = state.setChats.findIndex(value => value._id === action.payload._id)
        state.setChats[index] = action.payload
      })
      .addCase(addToGroupChat.rejected, (state, action) => {
        //console.log(action);
        state.loading = false;
        state.error = action.payload
      })


      .addCase(removeFromGroupChat.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromGroupChat.fulfilled, (state, action) => {
        // console.log(action);
        state.loading = false;
        state.selectedChat = action.payload
        
         const index = state.setChats.findIndex(value => value._id === action.payload._id)
         state.setChats[index] = action.payload
      })
      .addCase(removeFromGroupChat.rejected, (state, action) => {
        //console.log(action);
        state.loading = false;
        state.error = action.payload
      })


      .addCase(getAllMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllMessages.fulfilled, (state, action) => {
        // console.log(action);
        state.loading = false;
        state.messages = action.payload
      })
      .addCase(getAllMessages.rejected, (state, action) => {
        //console.log(action);
        state.loading = false;
        state.error = action.payload
      })

      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        // console.log(action);
        state.loading = false;
        state.messages = [...state.messages,action.payload]
        
      })
      .addCase(sendMessage.rejected, (state, action) => {
        //console.log(action);
        state.loading = false;
        state.error = action.payload
      })
  },
});

export default chatSlice.reducer;
export const {changeChats,setChat, changeSelectedChat, emptySelectedChat, setMessages, setNoti, deleteNoti} = chatSlice.actions

// const authSlice = createSlice({
//     name: "auth",
//     initialState: {
//       user: null,
//       error: "",
//       loading: false,
//       searchedUsers: null
//     },
//     reducers: {
//       setUser: (state, action) => {
//         state.user = action.payload;
//       },
//       setError: (state) => {
//         state.error = ""
//       },
//       setLogOut:(state) =>{
//           localStorage.clear();
//         state.user = null;
//       }
//     },
//     extraReducers: (builder) => {
//       builder
//             .addCase(signUp.pending, (state) => {
//               state.loading = true;
//             })
//             .addCase(signUp.fulfilled, (state, action) => {
//               // console.log(action);
//               localStorage.setItem('profile',JSON.stringify({...action.payload}))
//               state.loading = false;
//               state.user = action.payload
//             })
//             .addCase(signUp.rejected, (state, action) => {
//               //console.log(action);
//               state.loading = false;
//               state.error = action.payload
//             })

//             .addCase(googleSignIn.pending, (state) => {
//               state.loading = true;
//             })
//             .addCase(googleSignIn.fulfilled, (state, action) => {
//               // console.log(action);
//               localStorage.setItem('profile',JSON.stringify({...action.payload}))
//               state.loading = false;
//               state.user = action.payload
//             })
//             .addCase(googleSignIn.rejected, (state, action) => {
//               //console.log(action);
//               state.loading = false;
//               state.error = action.payload
//             })

//             .addCase(logIn.pending, (state) => {
//               state.loading = true;
//             })
//             .addCase(logIn.fulfilled, (state, action) => {
//               // console.log(action);
//               localStorage.setItem('profile',JSON.stringify({...action.payload}))
//               state.loading = false;
//               state.user = action.payload
//             })
//             .addCase(logIn.rejected, (state, action) => {
//               //console.log(action);
//               state.loading = false;
//               state.error = action.payload
//             })

//             .addCase(searchUser.pending, (state) => {
//               state.loading = true;
//             })
//             .addCase(searchUser.fulfilled, (state, action) => {
//               state.loading = false;
//               state.searchedUsers = action.payload
//             })
//             .addCase(searchUser.rejected, (state, action) => {
//               //console.log(action);
//               state.loading = false;
//               state.error = action.payload
//             })
//     },
//   });

//   export default authSlice.reducer

//   export const {setError,setUser,setLogOut} = authSlice.actions
