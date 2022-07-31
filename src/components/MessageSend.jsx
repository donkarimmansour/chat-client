import React from 'react'
import { AiFillGift, BiMessageAltEdit, BsPlusCircle, RiGalleryLine } from 'react-icons/all'

const MessageSend = ({ inputHendle, newMessage, sendMessage, emojiSend, ImageSend }) => {

    const emojis = [
        '😀', '😃', '😄', '😁',
        '😆', '😅', '😂', '🤣',
        '😊', '😇', '🙂', '🙃',
        '😉', '😌', '😍', '😝',
        '😜', '🧐', '🤓', '😎',
        '😕', '🤑', '🥴', '😱'
    ]


    return (
        <div className='message-send-section'>
            <input type="checkbox" id='emoji' />


        

            <div className="file hover-attachment">
                <div className="add-attachment">
                    Add Attachment
                </div>

                <input onChange={(e) => {ImageSend(e , "file")}} type="file" id='att' className="form-control" style={{display : "none"}} accept=".pdf , .xlsx , .xls , .csv"/>
                <label htmlFor="att"> <BsPlusCircle /></label>
            </div>


            <div className="file hover-image">
                <div className="add-image">
                    Add Image
                </div>
                <input onChange={(e) => {ImageSend(e , "img")}} type="file" id='pic' className="form-control" accept="image/*"/>
                <label htmlFor="pic"><RiGalleryLine /></label>
            </div>




            <div className="message-type">
                <input onChange={inputHendle} type="text" name='message' id='message' placeholder='Aa' value={newMessage} className="form-control" />
                <label htmlFor="emoji">🙂</label>
            </div>
        
            <div onClick={sendMessage} className="file">
                ❤️
            </div>

            <div className="emoji-section">
                <div className="emoji">
                    {
                        emojis.map((e,index) => <span key={index} onClick={() => emojiSend(e)} >{e}</span>)
                    }
                </div>
            </div>



        </div>
    )
}

export default MessageSend
