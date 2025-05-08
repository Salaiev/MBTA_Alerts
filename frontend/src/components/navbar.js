import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {
  Container,
  Nav,
  Navbar,
  NavDropdown,
} from "react-bootstrap";
import { PersonCircle, Gear } from "react-bootstrap-icons";
import getUserInfo from "../utilities/decodeJwt";

export default function DesignNavbar() {
  const [user, setUser] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Sync user state with localStorage
  const syncUser = () => {
    const info = getUserInfo();
    setUser(info);
    // Redirect to /schedule after login from /login
    if (info && location.pathname === "/login") {
      navigate("/schedule");
    }
  };

  useEffect(() => {
    syncUser();
    window.addEventListener("storage", syncUser);
    window.addEventListener("focus", syncUser);
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("focus", syncUser);
    };
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    setShowLogout(false);
    setUser(null);
    navigate("/login");
  };

  return (
    <>
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        className="py-3 shadow-lg"
        style={{ borderBottom: "2px solid #00ff88", fontFamily: "'Segoe UI', sans-serif" }}
      >
        <Container fluid>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto ms-4">
              <Nav.Link href="/schedule" className="mx-3 nav-hover-effect"><span className="h5">Schedule</span></Nav.Link>
              <Nav.Link href="/alerts" className="mx-3 nav-hover-effect"><span className="h5">Alerts</span></Nav.Link>
              <Nav.Link href="/feedback" className="mx-3 nav-hover-effect"><span className="h5">Feedback</span></Nav.Link>
            </Nav>

            <Nav className="ms-auto">
              <NavDropdown
                title={
                  <div className="d-flex align-items-center">
                    <PersonCircle className="text-light me-2" size={28} />
                    <div className="text-start">
                      <span className="d-block h6 mb-0">{user?.name || "Guest"}</span>
                      <small className="text-muted">{user?.email || "Not logged in"}</small>
                    </div>
                  </div>
                }
                id="user-nav-dropdown"
                menuVariant="dark"
                align="end"
                className="px-3"
              >
                {user ? (
                  <>
                    <NavDropdown.Item href="/privateUserProfile" className="py-3">
                      <PersonCircle className="me-3" size={20} /> Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/settings" className="py-3">
                      <Gear className="me-3" size={20} /> Settings
                    </NavDropdown.Item>
                    <NavDropdown.Divider className="bg-secondary" />
                    <NavDropdown.Item onClick={() => setShowLogout(true)} className="py-3 text-danger">
                      <i className="fas fa-sign-out-alt me-3"></i> Logout
                    </NavDropdown.Item>
                  </>
                ) : (
                  <NavDropdown.Item href="/login" className="py-3">
                    <i className="fas fa-sign-in-alt me-3"></i> Log In
                  </NavDropdown.Item>
                )}
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Logout Modal */}
      <Modal show={showLogout} onHide={() => setShowLogout(false)} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Log Out</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to log out?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogout(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleLogout}>Yes, Log Out</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
