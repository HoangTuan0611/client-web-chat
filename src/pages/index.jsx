import React, { useState, useRef, useEffect } from "react";
import '../App.css'
import { useNavigate } from 'react-router-dom';

const SetupPage = ( { username, setUsername, room, setRoom, socket } ) =>
{
  const navigate = useNavigate();

  const handleChangeUser = ( e ) =>
  {
    setUsername( e.target.value );
  };

  const handleChangeRoom = ( e ) =>
  {
    setRoom( e.target.value );
  };

  const joinRoom = () =>
  {
    if ( room !== '' && username !== '' )
    {
      socket.emit( 'join_room', { username, room } );
    }
    navigate( '/roomchat', { replace: true } );
  };

  const setUp = () =>
  {
    return (
      <div className="title-box-chat">
        <div className="title">Nu Web Chat</div>
        <div className="common">
          <input
            value={ username }
            className="user"
            type="text"
            onChange={ handleChangeUser }
            placeholder="Username"
          />
        </div>
        <div className="common">
          <select onChange={ handleChangeRoom }>
            <option>-- Select Room --</option>
            <option value="dev">Dev</option>
            <option value="mkt">Mkt</option>
            <option value="all">All</option>
          </select>
        </div>

        <button onClick={ joinRoom }>Join</button>
      </div>
    )
  }

  return (
    setUp()
  )
};

export default SetupPage;
