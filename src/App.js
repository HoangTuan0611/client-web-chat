import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import { useState } from 'react';
import SetupPage from "./pages";
import io from 'socket.io-client';
import ChatRoom from "./components/chatroom";

const socket = io.connect( 'https://backend-web-chat.onrender.com', {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
});

const AppRoutes = () =>
{
  const [ username, setUsername ] = useState( '' ); // Add this
  const [ room, setRoom ] = useState( '' ); // Add this
  const routes = useRoutes( [
    {
      path: "/", element: <SetupPage username={ username } // Add this
        setUsername={ setUsername } // Add this
        room={ room } // Add this
        setRoom={ setRoom } // Add this
        socket={ socket } />
    },
    { path: "/roomchat", element: <ChatRoom username={ username } room={ room } socket={ socket } /> },
  ] );
  return routes;
};

function App ()
{
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
