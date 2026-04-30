import { Route, Routes } from "react-router-dom";
import VideoPlayer from "../src/features/video/Player";
import LandingPage from "./pages/Landing"
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Watch from "./pages/Watch";

function App() {
  return (
    // <div>
    //   <h1>Video Player</h1>

    //   <VideoPlayer
    //     src="https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8"
    //   />
    // </div>
    <div>
      <Routes>
        {/*Public Routes*/}
            <Route path ="/" element ={<LandingPage/>} />
            <Route path ="/login" element ={<LoginPage/>} />
            <Route path ="/register" element ={<RegisterPage/>} />
            <Route path ="/dashboard" element ={<Dashboard/>} />
            <Route path="/watch/:id" element={<Watch />} />
        {/*Protected Routes*/}

      </Routes>
    </div>
  );
}

export default App;