// client/src/components/Header.jsx
import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, logoutUser } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import NotificationIcon from "./notificationIcon"; // Import NotificationIcon component
import { IoPerson } from "react-icons/io5";
import logo from "../assets/logo.png";
import "../assets/style/index.css";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  const logoutHandler = () => {
    dispatch(logoutUser());
    dispatch(clearUser());
    localStorage.removeItem("userToken");
    navigate("/");
  };

  return (
    <header>
      <Navbar bg="primary" variant="dark" expand="md" collapseOnSelect>
        <Container>
          <LinkContainer to="/welcome">
            <Navbar.Brand>
              <img src={logo} alt="VL" className="navbar-logo" />
              SocialCars
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {auth.isAuthenticated ? (
                <>
                  <NotificationIcon /> {/* Use NotificationIcon component */}
                  <LinkContainer to="/forum">
                    <Nav.Link>
                      <i className="fas fa-comments"></i> Forum
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to={`/profile/${auth.user._id}`}>
                    <Nav.Link>
                      <span style={{ paddingRight: "12px" }}>
                        <IoPerson />
                      </span>
                      <i className="fas fa-user">{auth.user.userName}</i>
                    </Nav.Link>
                  </LinkContainer>
                  <Nav.Link onClick={logoutHandler}>
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </Nav.Link>
                </>
              ) : (
                <>
                  <LinkContainer to="/">
                    <Nav.Link>
                      <i className="fas fa-sign-in-alt"></i> Login
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/register">
                    <Nav.Link>
                      <i className="fas fa-user-plus"></i> Register
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;