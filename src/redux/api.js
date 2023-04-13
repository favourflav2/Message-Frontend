import axios from 'axios'

const devEnv = process.env.NODE_ENV !== "production"





const API = axios.create({baseURL:`${devEnv ? process.env.REACT_APP_lOCALHOST_API : process.env.REACT_APP_PROD_API}`})

API.interceptors.request.use((req)=>{
    if(localStorage.getItem("profile")){
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("profile")).token}`
    }
    return req
})

export function sign_Up(formData){
    return API.post("/auth/signup",formData)
}

export function log_In(formData){
    return API.post("/auth/login",formData)
}

export function googleSign_in(formData){
    return API.post("/auth/google",formData)
}

export function search_User(search){
    return API.get(`/auth/getAllUsers?search=${search}`)
}

export function get_Chats(userId){
    return API.post("/chat",userId)
}

export function get_All_Chats(){
    return API.get("/chat")
}

export function create_Group_Chat(users,name){
    return API.post("/chat/group",users,name)
}

export function update_Group_Chat(chatName,chatId){
    return API.put("/chat/update",chatName,chatId)
}

export function add_To_Group_Chat(userId,chatId){
    return API.put("/chat/addToGroup",userId,chatId)
}

export function remove_From_Group(userId,chatId){
    return API.put("/chat/removeFromGroup",userId,chatId)
}

export function get_All_Messages(chatId){
    return API.get(`/message/${chatId}`)
}

export function send_Message(chatId,content){
    return API.post(`/message/sendMessage`,chatId,content)
}