import "./App.css";
import { useMemo } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import useLocalStorage from "./hooks/useLocalStorage";
import NewNote from "./pages/NewNote";
import Home from "./pages/Home";
import { Note,rawNotes, Tag } from "./types/types";
import Register from "./pages/Register";
import ProtectedRouteMiddleware from "./middleware/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import Teams from "./pages/Teams";
import NewTeam from "./pages/NewTeam";
import HomeLayout from "./pages/HomeLayout";
import { AnimatePresence } from 'framer-motion'
import EditProfile from "./pages/EditProfile";

function App() {
  const location = useLocation()
  

  return (
    <div className="h-screen overflow-hidden">
      <ToastContainer />
      <AnimatePresence>
        <Routes location={location} key = {location.pathname}>
          <Route element={<ProtectedRouteMiddleware />} path="/" >
            <Route path="" element={<HomeLayout />}>
              <Route index element={<Home />} />
              {/* Notes */}
              <Route path="/new" element={<NewNote />} />

              {/* Teams */}
              <Route path="/new-team" element={<NewTeam />} />
              <Route path="/team/:teamID" element={<Teams />} />
            </Route>
            <Route path="/build-profile" element={<EditProfile  />} />
          </Route>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="*" element={<p className="text-3xl">Back Home</p>} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
