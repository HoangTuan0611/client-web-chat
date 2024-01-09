import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import SetupPage from "./pages";
import RoomChat from "./pages/roomchat";

const AppRoutes = () => {
  const routes = useRoutes([
    { path: "/", element: <SetupPage /> },
    { path: "/roomchat", element: <RoomChat /> },
  ]);
  return routes;
};

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
