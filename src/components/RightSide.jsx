import React from 'react'
import { BsCameraVideoFill } from 'react-icons/bs'
import { HiDotsCircleHorizontal } from 'react-icons/hi'
import { IoCall } from 'react-icons/io5'
import { ImageVIEW } from '../common/funs'
import FriendInfo from './FriendInfo'
import Message from './Message'
import MessageSend from './MessageSend'

const RightSide = (props) => {
    const {
        currentfriend,
        inputHendle,
        newMessage,
        sendMessage,
        message,
        scrollRef,
        emojiSend,
        ImageSend,
        activeUser,
        typingMessage
    } = props;
    return (
        <div className='col-9'>
            <div className="right-side">
                <input type="checkbox" id='dot' />
                <div className="row">
                    <div className="col-8">
                        <div className="message-send-show">
                            <div className="header">
                                <div className="image-name">
                                    <div className="image">

                                        <img src={ImageVIEW(currentfriend.image)} alt="" />
                                        {
                                            activeUser && activeUser.length > 0 && activeUser.some(u => u.userId === currentfriend._id) ? <div className="active-icon"></div> : ''
                                        }

                                    </div>
                                    <div className="name">
                                        <h3> {currentfriend.userName}</h3>
                                    </div>
                                </div>
                                <div className="icons">
                                 
                                    <div className="icon">
                                        <label htmlFor="dot"><HiDotsCircleHorizontal /></label>
                                    </div>
                                </div>
                            </div>

                            <Message typingMessage={typingMessage} currentfriend={currentfriend} scrollRef={scrollRef} message={message} />
                            <MessageSend
                                ImageSend={ImageSend}
                                emojiSend={emojiSend}
                                sendMessage={sendMessage}
                                inputHendle={inputHendle}
                                newMessage={newMessage}
                            /> 
                            
                        </div>
                    </div>
                    <div className="col-4">
                        <FriendInfo message={message} currentfriend={currentfriend} activeUser={activeUser} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RightSide
