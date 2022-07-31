import React, { useEffect, useState, useRef } from 'react'
import { BiSearch } from "react-icons/all";
import Friends from './Friends';
import RightSide from './RightSide';
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { getFriends, messageSend, getMessage, ImageMessageSend, seenMessage, delivaredMessage, } from "../store/actions/messengerAction";
import useSound from 'use-sound';
import notificationSound from '../audio/notification.mp3';
import sendingSound from '../audio/sending.mp3';
import { CLEAR_MESSAGE } from '../store/types/message';
import { DELIVARED_MESSAGE, SEEN_ALL, SEEN_MESSAGE, SOCKET_MESSAGE, UPDATE_FRIEND_MESSAGE, UPDATE_FRIEND_STATUS } from '../store/types/messengerType';
import ActiveFriend from './ActiveFriend';
import { Create } from '../services/file';
import { ImageVIEW } from '../common/funs';

const Messenger = () => {

    // const [notificationSPlay  , { stop  }] = useSound(notificationSound);
    // //const [sendingSPlay , , { stop : stopTwo  }]  = useSound(sendingSound);

    // useEffect(() => {
    //     stop()
    //   }, [stop]);

    //   const notificationSPlay = new Audio(notificationSound)
    //   const sendingSPlay = new Audio(sendingSound)
      
    //   useEffect(() => {
    //       notificationSPlay.play()
    //       // .then(_ => {
    //       //     // autoplay starts!
    //       // }).catch(error => {
    //       //    //show error
    //       // })
    //   }, [notificationSPlay]);
  

    //redux
    const { myInfo } = useSelector(state => state.auth);
    const { friends, message } = useSelector(state => state.messenger);
    const { successMsg } = useSelector(state => state.message);
    // const { loading} = useSelector(state => state.loading);


    // socket 
    const socket = useRef();

    //scroll
    const scrollRef = useRef();
 
    //redux
    const dispatch = useDispatch();

    //states
    const [currentfriend, setCurrentFriend] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [activeUser, setActiveUser] = useState([]);
    const [socketMessage, setSocketMessage] = useState('');
    const [NewUserAdd, setNewUserAdd] = useState(false);
    const [typingMessage, setTypingMessage] = useState('')
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        socket.current = io('ws://localhost:8080');

        //set new uer
        socket.current.emit('addUser', myInfo)

        //get new message
        socket.current.on('getMessage', (data) => {
            setSocketMessage(data);
        }) 

        //realtime typing
        socket.current.on('typingMessageGet', (data) => {
            setTypingMessage(data);
        })


        //see all
        socket.current.on('msgSeenResponse', msg => {

            dispatch({
                type: SEEN_MESSAGE,
                payload: msg
            })
        })

       //see current one
        socket.current.on('seenSuccess', data => {
            dispatch({
                type: SEEN_ALL,
                payload: data
            })
        })

        //Delivared alert
        socket.current.on('msgDelivaredResponse', msg => {
            dispatch({
                type: DELIVARED_MESSAGE,
                payload: msg
            })
        })
      

    }, []);




    useEffect(() => {
        // get Online Users
        socket.current.on('getUser', (users) => {

            const filterUser = users.filter(u => u.userId !== myInfo.id);
            setActiveUser(filterUser);

        });

       // new user add alert
        // socket.current.on('new_user_add', () => {
        //     setNewUserAdd(true)
        // })

    }, [])



    // //set Friends
     useEffect(() => {
    //     if (NewUserAdd) {
           dispatch(getFriends(myInfo.id));
    //         setNewUserAdd(false)
    //     }

     }, [dispatch]);
    // }, [NewUserAdd]);

    //get Message
    useEffect(() => {
        if (friends && friends.length > 0) {
            dispatch(getMessage(myInfo.id , currentfriend._id));
        }

    }, [currentfriend?._id])

    //initial Messages
    useEffect(() => {
        if (friends && friends.length > 0) {
            setCurrentFriend(friends[0].fndInfo);
        }
    }, [friends])



    // send new Message
    const sendMessage = (e) => {
                e.preventDefault();
               // sendingSPlay();

                const data = {
                    senderId: myInfo.id,
                    senderName: myInfo.userName,
                    reseverId: currentfriend._id,
                    message: newMessage ? newMessage : '❤️'
                }

                // set realtime typing
                socket.current.emit('typingMessage', {
                    senderId: myInfo.id,
                    reseverId: currentfriend._id,
                    msg: ''
                })

                // send msg to api
                dispatch(messageSend(data));
                setNewMessage('')
    }

        // on Success Send message in local
          useEffect(() => {
            if (successMsg === "MessageSend") {

                //new message
                socket.current.emit('sendMessage', message[message.length - 1]); //last msg

                //update friend last message
                dispatch({
                    type: UPDATE_FRIEND_MESSAGE,
                    payload: {
                        msgInfo: message[message.length - 1] //last msg
                    }
                })

            } //get Message 
            else if(successMsg === "getMessage"){
                if (message.length > 0) {
 
                    if (message[message.length - 1].senderId !== myInfo.id && message[message.length - 1].status !== 'seen') {
 
                        //update friend see
                        dispatch({
                            type: UPDATE_FRIEND_STATUS,
                            payload: currentfriend._id
                        })
 
                        //see in other
                         socket.current.emit('seen', { senderId: currentfriend._id, reseverId: myInfo.id });
 
                       //see all msg
                        dispatch(seenMessage({ _id : message[message.length - 1]._id }))
                    }
                }
 
            } 
            
            dispatch({ type: CLEAR_MESSAGE })

        }, [successMsg])




        useEffect(() => {
              // on Success Send from user to me
            if (socketMessage && currentfriend) {

                if (socketMessage.senderId === currentfriend._id && socketMessage.reseverId === myInfo.id) {
                       
                    //insert new msg
                    dispatch({
                        type: SOCKET_MESSAGE,
                        payload:  socketMessage
                    })

                    //see this msg
                    dispatch(seenMessage({_id : socketMessage._id}));

                    socket.current.emit('messageSeen', socketMessage);

                    dispatch({
                        type: UPDATE_FRIEND_MESSAGE,
                        payload: {
                            msgInfo: socketMessage,
                            status: 'seen'
                        }
                    })

                    setSocketMessage('')


                } // on Success Send from user to me in outside
                
                else if (socketMessage && socketMessage.senderId !== currentfriend._id && socketMessage.reseverId === myInfo.id) {
                //    notificationSPlay();
                    alert(`${socketMessage.senderName} send a new message`)
    
                     dispatch(delivaredMessage(socketMessage));
    
                     socket.current.emit('delivaredMessage', socketMessage);
    
                    dispatch({
                        type: UPDATE_FRIEND_MESSAGE,
                        payload: {
                            msgInfo: socketMessage,
                            status: 'delivared'
                        }
                    })
                }

            }
           
        }, [socketMessage])






    // search
    const search = (e) => {

            const getFriendClass = document.getElementsByClassName('hover-friend');
            const frienNameClass = document.getElementsByClassName('Fd_name');

            for (var i = 0; i < getFriendClass.length , i < frienNameClass.length; i++) {

                let text = frienNameClass[i].innerText.toLowerCase();

                if (text.indexOf(e.target.value.toLowerCase()) > -1) {
                    getFriendClass[i].style.display = '';
                } else {
                    getFriendClass[i].style.display = 'none';
                }
            }
    }



    //input Hendle
    const inputHendle = (e) => {
        setNewMessage(e.target.value);

        socket.current.emit('typingMessage', {
            senderId: myInfo.id,
            reseverId: currentfriend._id,
            msg: e.target.value
        })
    }


    //emoji Send
    const emojiSend = (emu) => {
        setNewMessage(`${newMessage}` + emu);

        socket.current.emit('typingMessage', {
            senderId: myInfo.id,
            reseverId: currentfriend._id,
            msg: emu
        })
    }

    //Image Send
    const ImageSend = (e , type) => {    
    
        if (e.target.files.length !== 0) {
             //    sendingSPlay();

            const formData = new FormData();
            formData.append('image', e.target.files[0]);
           
           // setLoading(true)

            Create(formData).then(({ data }) => {

                if (!data.err) {
                  //  setLoading(true)
                  const messageDate = {senderName : myInfo.userName , senderId : myInfo.id , reseverId : currentfriend._id , image : data.msg , type }
                  dispatch(ImageMessageSend(messageDate));

                } else {
                  //  setLoading(false)
                  alert("there was an error while upload your file")
                }
                //  console.log(data);

            }).catch(err => {
                console.log("get orders api err ", err);
             //   setLoading(false)
            })
        }

    }




    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [message]);



    //logout
    const logout = () => {
        //  dispatch(userLogout());
        socket.current.emit('logout', myInfo.id);
    }



    return (
        <div >
        
            <div className="row">
                <div className="col-3">
                    <div className="left-side">
                        <div className="top">
                            <div className="image-name">
                                <div className="image">
                                    <img src={ImageVIEW(myInfo.image)} alt="" />
                                </div>
                                <div className="name">
                                    <h3>{myInfo.userName}</h3>
                                </div>
                            </div>
                            {/* <div className="icons">
                                <div onClick={() => setHide(!hide)} className="icon">
                                    <BsThreeDots />
                                </div>
                                <div className="icon">
                                    <FaEdit />
                                </div>
                                <div className={hide ? 'theme_logout' : 'theme_logout show'}>
                                    <h3>Dark Mode</h3>
                                    {/* <div className="on">
                                        <label htmlFor="dark">ON</label>
                                        <input onChange={(e) => dispatch(themeSet(e.target.value))} value='dark' type="radio" name='theme' id='dark' />
                                    </div>

                                    <div className="of">
                                        <label htmlFor="white">OFF</label>
                                        <input onChange={(e) => dispatch(themeSet(e.target.value))} value='white' type="radio" name='theme' id='white' />
                                    </div> /}
                                    <div onClick={logout} className="logout">
                                        <IoLogOutOutline />Logout
                                    </div>
                                </div>
                            </div>
                         */}


                        </div>
                        <div className="friend-search">
                            <div className="search">
                                <input onChange={search} type="text" placeholder='search' className="form-control" />
                            </div>
                        </div>
                        <div className="active-friends">
                            {
                                activeUser && activeUser.length > 0 ? activeUser.map((u , i) => <ActiveFriend key={i} setCurrentFriend={setCurrentFriend} user={u} />) : ''
                            }

                        </div>
                        <div className="friends">
                            {
                                friends && friends.length > 0 ? friends.map((fd, index) => <div key={index} onClick={() => setCurrentFriend(fd.fndInfo)} className={currentfriend._id === fd.fndInfo._id ? 'hover-friend active' : 'hover-friend'}>
                                    <Friends activeUser={activeUser} myId={myInfo.id} friend={fd} />
                                </div>) : 'no friend'
                            }

                        </div>
                    </div>
                </div>
                {
                    currentfriend ? <RightSide
                        activeUser={activeUser}
                        ImageSend={ImageSend}
                        currentfriend={currentfriend}
                        inputHendle={inputHendle}
                        newMessage={newMessage}
                        sendMessage={sendMessage}
                        message={message}
                        scrollRef={scrollRef}
                        emojiSend={emojiSend}
                        typingMessage={typingMessage}
                    /> : 'Please select you friend'
                }

            </div>
        </div>
    )
}

export default Messenger
