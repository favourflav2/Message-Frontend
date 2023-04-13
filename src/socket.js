import { io } from "socket.io-client"

const devEnv = process.env.NODE_ENV !== "production"

const {REACT_APP_LOCALHOST_API,REACT_APP_PROD_API} = process.env

const ENDPOINT = "http://localhost:5001"

export const socket = io(`${devEnv ? process.env.REACT_APP_LOCALHOST_API : process.env.REACT_APP_PROD_API} `)