// client/src/App.js
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginScreen from "./screens/LoginScreen";
import AboutScreen from "./screens/AboutScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/profileScreen";
import ForumScreen from "./screens/forumScreen";
import loadUser from "./slices/auth";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser()); // Load user data on app load
  }, [dispatch]);

  // test

  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route path="/forum" element={<ForumScreen />} />
            </Route>
            <Route path="/" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/about" element={<AboutScreen />} />
            <Route element={<PrivateRoute />}>
              <Route path="/welcome" element={<WelcomeScreen />} />
            </Route>
            <Route path="/profile/:userId" element={<ProfileScreen />} />
          </Routes>
        </Container>
      </main>
      <Footer />
      <ToastContainer />
    </Router>
  );
};

export default App;
