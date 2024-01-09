import React, { useState } from "react";
import ChatRoom from "../components/chatroom";

const SetupPage = () => {
  const [user, setUser] = useState();

  const handleChangeUser = (e) => {
    setUser(e.target.value);
  };

  const addUser = () => {
    return <ChatRoom user={user}/>
  };

  return (
    <div className="title-box-chat">
      <div className="title">Join Room Chat</div>
      <input
        value={user}
        className="user"
        type="text"
        onChange={handleChangeUser}
        placeholder="Please enter your username"
      />
      <button onClick={addUser}>Join</button>
    </div>
  );
};

export default SetupPage;
