import React, { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
import "../../App.css";

const host = "http://localhost:3000";

const ChatRoom = (props) => {
  const [mess, setMess] = useState([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState();
  const [id, setId] = useState();

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient.connect(host);

    socketRef.current.on("getId", (data) => {
      setId(data);
    });

    socketRef.current.on("sendDataServer", (dataGot) => {
      setMess((oldMsgs) => [...oldMsgs, dataGot.data]);
    });

    socketRef.current.on("addUser", (dataGot) => {
      console.log("userList", dataGot);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const renderMess = mess.map((m, index) => (
    <div
      key={index}
      className={`${m.id === id ? "your-message" : "other-people"} chat-item`}
    >
      {m.username} said: {m.content}
    </div>
  ));

  const sendMessage = () => {
    if (message !== null) {
      const msg = {
        content: message,
        id: id,
        username: user,
      };
      console.log(msg);
      socketRef.current.emit("sendDataClient", msg);

      setMessage("");
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleChangeUser = (e) => {
    setUser(e.target.value);
  };

  const addUser = () => {
    console.log(user);
    socketRef.current.emit("addUser", user);
  };

  return (
    <div className="box-chat">
      {/* <div className="title-box-chat">
        <div className="title">Room</div>
        <input
          value={user}
          className="user"
          type="text"
          onChange={handleChangeUser}
        />
        <button onClick={addUser}>Add</button>
      </div> */}
      <div className="box-chat_message">{renderMess}</div>

      <div className="send-box">
        <textarea
          value={message}
          onChange={handleChange}
          placeholder="Typing..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatRoom;
