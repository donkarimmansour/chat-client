import axios from "axios"
import {Host , ApiEndpoints} from "../common/apiEndPoints"

const config = {
    Headers : {
       "Content-Type" : "application/json" 
    } 
    
}


const messageSendApi = async (data) => {
    return  await  axios.post(`${Host.BACKEND}${ApiEndpoints.ChatEndpoints.route}${ApiEndpoints.ChatEndpoints.sendMessage}` , data , config)
}

const ImageMessageSendApi = async (data) => {
    return  await  axios.post(`${Host.BACKEND}${ApiEndpoints.ChatEndpoints.route}${ApiEndpoints.ChatEndpoints.imageMessageSend}` , data , config)
}

const seenMessageApi = async (data) => {
    return  await  axios.put(`${Host.BACKEND}${ApiEndpoints.ChatEndpoints.route}${ApiEndpoints.ChatEndpoints.seenMessage}` , data , config)
}

const delivaredMessageApi = async (data) => {
    return  await  axios.put(`${Host.BACKEND}${ApiEndpoints.ChatEndpoints.route}${ApiEndpoints.ChatEndpoints.delivaredMessage}` , data , config)
}

const getFriendsApi = async (id) => {
    return await axios.get(
      `${Host.BACKEND}${ApiEndpoints.ChatEndpoints.route}${ApiEndpoints.ChatEndpoints.getFriends}/${id}`, { headers: { ...config.headers } }
    );
};

const getMessageApi = async (myId, fdId) => {
    return await axios.get(
      `${Host.BACKEND}${ApiEndpoints.ChatEndpoints.route}${ApiEndpoints.ChatEndpoints.getMessage}/${myId}/${fdId}`, { headers: { ...config.headers } }
    );
};
  

export {seenMessageApi  , getMessageApi , getFriendsApi , delivaredMessageApi , ImageMessageSendApi , messageSendApi }


