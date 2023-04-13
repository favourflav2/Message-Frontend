import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { googleSign_in, log_In, search_User, sign_Up } from "../api";

export const signUp = createAsyncThunk(
  "signup",
  async ({ formData, navigate, toast }, { rejectWithValue }) => {
    try {
      const res = await sign_Up(formData);
      toast.success("Sign Up Successfull");
      navigate("/");
      return res.data
    } catch (e) {
        return rejectWithValue(e.response.data.msg)
    }
  }
);


export const googleSignIn = createAsyncThunk(
    "googleSign",
    async ({ result, navigate, toast }, { rejectWithValue }) => {
      try {
        const res = await googleSign_in(result);
        toast.success("Sign Up Successfull");
        navigate("/");
        return res.data
      } catch (e) {
          return rejectWithValue(e.response.data.msg)
      }
    }
  );


  export const logIn = createAsyncThunk(
    "logIn",
    async ({ formData, navigate, toast }, { rejectWithValue }) => {
      try {
        const res = await log_In(formData);
        toast.success("Sign Up Successfull");
        navigate("/");
        return res.data
      } catch (e) {
          return rejectWithValue(e.response.data.msg)
      }
    }
  );

  export const searchUser = createAsyncThunk(
    "searchUser",
    async (search, { rejectWithValue }) => {
      try {
        const res = await search_User(search);
        return res.data
      } catch (e) {
          return rejectWithValue(e.response.data.msg)
      }
    }
  );



const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    error: "",
    loading: false,
    searchedUsers: null
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setError: (state) => {
      state.error = ""
    },
    setLogOut:(state) =>{
        localStorage.clear();
      state.user = null;
    },
    changeSearchedUsers:(state)=>{
      state.searchedUsers = null
    }
  },
  extraReducers: (builder) => {
    builder
          .addCase(signUp.pending, (state) => {
            state.loading = true;
          })
          .addCase(signUp.fulfilled, (state, action) => {
            // console.log(action);
            localStorage.setItem('profile',JSON.stringify({...action.payload}))
            state.loading = false;
            state.user = action.payload
          })
          .addCase(signUp.rejected, (state, action) => {
            //console.log(action);
            state.loading = false;
            state.error = action.payload
          })


          .addCase(googleSignIn.pending, (state) => {
            state.loading = true;
          })
          .addCase(googleSignIn.fulfilled, (state, action) => {
            // console.log(action);
            localStorage.setItem('profile',JSON.stringify({...action.payload}))
            state.loading = false;
            state.user = action.payload
          })
          .addCase(googleSignIn.rejected, (state, action) => {
            //console.log(action);
            state.loading = false;
            state.error = action.payload
          })


          .addCase(logIn.pending, (state) => {
            state.loading = true;
          })
          .addCase(logIn.fulfilled, (state, action) => {
            // console.log(action);
            localStorage.setItem('profile',JSON.stringify({...action.payload}))
            state.loading = false;
            state.user = action.payload
          })
          .addCase(logIn.rejected, (state, action) => {
            //console.log(action);
            state.loading = false;
            state.error = action.payload
          })


          .addCase(searchUser.pending, (state) => {
            state.loading = true;
          })
          .addCase(searchUser.fulfilled, (state, action) => {
            state.loading = false;
            state.searchedUsers = action.payload
          })
          .addCase(searchUser.rejected, (state, action) => {
            //console.log(action);
            state.loading = false;
            state.error = action.payload
          })
  },
});

export default authSlice.reducer

export const {setError,setUser,setLogOut,changeSearchedUsers} = authSlice.actions