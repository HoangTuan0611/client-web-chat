import React, { useState, useEffect, useRef } from "react";
import "../../App.css";

const ChatRoom = ( props ) =>
{
  const { username, room, socket } = props
  const [ mess, setMess ] = useState( [] );
  const [ message, setMessage ] = useState( "" );
  const [ file, setFile ] = useState();
  const [ image, setImage ] = useState( '' )

  useEffect( () =>
  {
    socket.on( 'receive_message', ( data ) =>
    {
      console.log( data );
      setMess( ( oldMsgs ) => [ ...oldMsgs, data ] );
      setImage( `data:image/jpg;base64,${ data.file }` );
    } );

    return () => socket.off( 'receive_message' );
  }, [ socket ] );

  console.log(mess);
  const renderMess = mess.map( ( m, index ) => (
    <div
      key={ index }
      className={ `${ m.username === username ? "your-message" : "other-people" } chat-item` }
    >
      <div className="user_name">{ m.username }</div>
      <div className="user_message">{ m.message }</div>
      {
        m?.file !== '' 
        ? <div className="user_image">
          <img style={ { width: '100px', height: '100px' } } src={ `data:image/jpg;base64,${ m.file }` } />
        </div> 
        : null
      }
    </div>
  ) );

  const sendMessage = () =>
  {
    if ( message !== '' || file !== '' )
    {
      socket.emit( "send_message", { username, room, message, file } );;
      setMessage( "" );
      setFile( "" );
    }
  };

  const handleChange = ( e ) =>
  {
    setMessage( e.target.value );
  };

  const uploadFile = ( e ) =>
  {
    const file = e.target.files[ 0 ]
    setFile( file )
    socket.emit( "upload_file", { username, room, file } );
  }

  return (
    <div className="box-chat">
      <div className="box-chat_message">{ renderMess }</div>

      <div className="send-box">
        <textarea
          value={ message }
          onChange={ handleChange }
          placeholder="Typing..."
        />
        <input type="file" onChange={ uploadFile } />
        <button onClick={ sendMessage }>Send</button>
      </div>
    </div>
  );
};

export default ChatRoom;
