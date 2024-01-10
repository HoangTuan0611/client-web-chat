import React, { useState, useEffect, useRef } from "react";
import "../../App.css";
import Peer from "simple-peer"

const ChatRoom = ( props ) =>
{
  const { username, room, socket } = props
  const [ mess, setMess ] = useState( [] );
  const [ message, setMessage ] = useState( "" );
  const [ file, setFile ] = useState();
  const [ image, setImage ] = useState( '' )

  // 
  const [ me, setMe ] = useState( "" )
  const [ stream, setStream ] = useState()
  const [ receivingCall, setReceivingCall ] = useState( false )
  const [ caller, setCaller ] = useState( "" )
  const [ callerSignal, setCallerSignal ] = useState()
  const [ callAccepted, setCallAccepted ] = useState( false )
  const [ callEnded, setCallEnded ] = useState( false )
  const [ name, setName ] = useState( "" )
  const myVideo = useRef()
  const userVideo = useRef()
  const connectionRef = useRef()

  useEffect( () =>
  {
    socket.on( 'receive_message', ( data ) =>
    {
      setMess( ( oldMsgs ) => [ ...oldMsgs, data ] );
      setImage( `data:image/jpg;base64,${ data.file }` );
    } );

    return () => socket.off( 'receive_message' );
  }, [ socket ] );

  useEffect( () =>
  {
    navigator.mediaDevices.getUserMedia( { video: true, audio: true } ).then( ( stream ) =>
    {
      setStream( stream )
      if ( myVideo.current !== undefined )
      {
        myVideo.current.srcObject = stream
      }
    } )

    socket.on( "me", ( id ) =>
    {
      setMe( id )
    } )

    socket.on( "callUser", ( data ) =>
    {
      setReceivingCall( true )
      setCaller( data.from )
      setName( data.name )
      setCallerSignal( data.signal )
    } )
  }, [] )

  const callUser = () =>
  {
    const peer = new Peer( {
      initiator: true,
      trickle: false,
      stream: stream
    } )
    peer.on( "signal", ( data ) =>
    {
      socket.emit( "callUser", {
        userToCall: room,
        signalData: data,
        from: username,
        name: username
      } )
    } )
    peer.on( "stream", ( stream ) =>
    {
      userVideo.current.srcObject = stream
    } )
    socket.on( "callAccepted", ( signal ) =>
    {
      setCallAccepted( true )
      peer.signal( signal )
    } )

    connectionRef.current = peer
  }

  const answerCall = () =>
  {
    setCallAccepted( true )
    const peer = new Peer( {
      initiator: false,
      trickle: false,
      stream: stream
    } )
    peer.on( "signal", ( data ) =>
    {
      socket.emit( "answerCall", { signal: data, to: caller } )
    } )
    peer.on("stream", (stream) => {
			userVideo.current.srcObject = stream
		})

    peer.signal( callerSignal )
    connectionRef.current = peer
  }

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

  console.log(myVideo);
  console.log(userVideo);

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
        <button onClick={ () => callUser() }>Call</button>
        <button onClick={ sendMessage }>Send</button>
      </div>

      <div className="video-container">
        <div className="video-me">
          { stream && <video playsInline muted ref={ myVideo } autoPlay style={ { width: "300px" } } /> }
        </div>
        <div className="video-other">
          { callAccepted && !callEnded ?
            <video playsInline ref={ userVideo } autoPlay style={ { width: "300px" } } /> :
            '111' }
        </div>
      </div>
      <div>
        { receivingCall && !callAccepted && name !== username ? (
          <div className="caller">
            <h1 >{ name } is calling...</h1>
            <button onClick={ () => answerCall() }>Answer</button>
          </div>
        ) : null }
      </div>
    </div>
  );
};

export default ChatRoom;
