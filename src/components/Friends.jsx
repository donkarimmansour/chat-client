import React from 'react';
import moment from 'moment';
import { HiOutlineCheckCircle, RiCheckboxCircleFill } from "react-icons/all";
import { ImageVIEW } from '../common/funs';

const Friends = (props) => {
    const { activeUser , myId , friend : {fndInfo, msgInfo} } = props;
    
    return (
        <div className='friend'>
            <div className="friend-image">

                <div className="image">
                    <img src={ImageVIEW(fndInfo.image)} alt="" />
                    {
                        activeUser && activeUser.length > 0 && activeUser.some(u => u.userId === fndInfo._id) ? <div className="active_icon"></div> : ''
                    }
                </div>
            </div>
            
            <div className="friend-name-seen">


                <div className="friend-name">
                    <h4 className={msgInfo?.senderId !== myId &&  msgInfo?.status !== undefined && msgInfo?.status !== 'seen' ? 'unseen_message Fd_name':'Fd_name' } >{fndInfo.userName}</h4>
                   
                    <div className="msg-time">
                        {
                            msgInfo && msgInfo.senderId === myId ? <span>You </span> : <span className={msgInfo?.senderId !== myId &&  msgInfo?.status !== undefined && msgInfo?.status !== 'seen'?'unseen_message':'' }>{fndInfo.userName + ' '}</span>

                        }
                        {
                            msgInfo && msgInfo.message.type === "msg" ? <span className={msgInfo?.senderId !== myId &&  msgInfo?.status !== undefined && msgInfo?.status !== 'seen'?'unseen_message':'' }>{msgInfo.message.text.slice(0, 10)}</span> 
                           : msgInfo && msgInfo.message.type === "img" ? <span>send a image</span> 
                           : msgInfo && msgInfo.message.type === "file" ? <span>send a file</span> : <span>connect you</span>
                        }
                        <span>{msgInfo ? moment(msgInfo.createdAt).startOf('mini').fromNow() : moment(fndInfo.createdAt).startOf('mini').fromNow()}</span>
                    </div>
                    
                </div>
                {

                    myId === msgInfo?.senderId ?
                        <div className="seen-unseen-icon">

                            {
                                msgInfo.status === 'seen' ? <img src={ImageVIEW(fndInfo.image)} alt="" /> :
                                msgInfo.status === 'delivared' ? <div className="delivared"><RiCheckboxCircleFill /></div>
                                : <div className='unseen'><HiOutlineCheckCircle /></div>
                            }
                        </div> :
                        <div className="seen-unseen-icon">
                            {
                                msgInfo?.status !== undefined && msgInfo?.status !== 'seen' ? <div className="seen-icon"></div> : ''
                            }

                        </div>
                }
            </div>
        </div>
    )
}

export default Friends
