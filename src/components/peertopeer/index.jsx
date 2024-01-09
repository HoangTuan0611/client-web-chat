import React, { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
import "../../App.css";

const host = "http://localhost:3000";

const ChatRoom = () => {
  const [mess, setMess] = useState([]);
  const [message, setMessage] = useState("");
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
      console.log(dataGot);
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
      {m.content}
    </div>
  ));

  const sendMessage = () => {
    if (message !== null) {
      const msg = {
        content: message,
        id: id,
      };
      console.log(msg);
      socketRef.current.emit("sendDataClient", msg);

      setMessage("");
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div className="box-chat">
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
