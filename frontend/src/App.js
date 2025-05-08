import React, { createContext, useState, useEffect } from "react";
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
import './css/card.css';
import './index.css';

// We import all the components we need in our app
import Navbar from "./components/navbar";
import LandingPage from "./components/pages/landingPage";
import HomePage from "./components/pages/homePage";
import Login from "./components/pages/loginPage";
import Signup from "./components/pages/registerPage";
import PrivateUserProfile from "./components/pages/privateUserProfilePage";
import Alerts from "./components/pages/alertsPage";
import Feedback from "./components/pages/feedbackPage";
import MainSchedule from "./components/pages/MainSchedule";
import RequireAuth from "./components/RequireAuth";
import getUserInfo from "./utilities/decodeJwt";
import SettingsPage from "./components/pages/SettingsPage";


export const UserContext = createContext();

const App = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    setUser(getUserInfo());
  }, []);

  return (
    <>
      <Navbar />
      <UserContext.Provider value={user}>
        <Routes>
          {/* Public routes */}
          <Route exact path="/" element={<LandingPage />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />

          {/* Protected routes */}
          <Route element={<RequireAuth />}>
            <Route exact path="/" element={<MainSchedule />} />
            <Route exact path="/home" element={<HomePage />} />
            <Route exact path="/alerts" element={<Alerts />} />
            <Route exact path="/feedback" element={<Feedback />} />
            <Route exact path="/schedule" element={<MainSchedule />} />
            <Route path="/privateUserProfile" element={<PrivateUserProfile />} />
            <Route path="/settings" element={<SettingsPage />} />

          </Route>
        </Routes>
      </UserContext.Provider>
    </>
  );
};

export default App;
