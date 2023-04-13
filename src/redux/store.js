import { configureStore } from '@reduxjs/toolkit'
import authSlice from './features/authSlice'
import chatSlice from './features/chatSlice'

export const store = configureStore({
    reducer:{
        auth:authSlice,
        chat:chatSlice
    }
})