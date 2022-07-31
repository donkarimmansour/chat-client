
const Host = {
  ROOT: "http://localhost:3000",
  BACKEND: (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? "http://localhost:3005" : "https://api.solidernet.com" ,
  PREFIX: "/v1/api",  
};
 
const ApiEndpoints = {
 
  ChatEndpoints: { 
    route: `${Host.PREFIX}/chat`, 
    getFriends: `/get-friends`, 
    sendMessage: `/send-message`, 
    getMessage: `/get-message`, 
    imageMessageSend: `/image-message-send`, 
    seenMessage: `/seen-message`,  
    delivaredMessage: `/delivared-message`, 
  },

  FileEndpoints: {
    route: `${Host.PREFIX}/file`,
    getSingleFileView: `/get-single-file`,
    getSingleFileDownload: `/get-single-file`,
    createSingleFile: `/create-single-file`,
  },
 
};
 
export {ApiEndpoints , Host}