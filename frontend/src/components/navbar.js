import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    const info = getUserInfo();
    setUser(info);
  }, []);

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      className="py-3 shadow-lg"
      style={{
        borderBottom: "2px solid #00ff88",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <Container fluid>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto ms-4">
            <Nav.Link href="/schedule" className="mx-3 nav-hover-effect">
              <span className="h5">Schedule</span>
            </Nav.Link>
            <Nav.Link href="/alerts" className="mx-3 nav-hover-effect">
              <span className="h5">Alerts</span>
            </Nav.Link>
            <Nav.Link href="/feedback" className="mx-3 nav-hover-effect">
              <span className="h5">Feedback</span>
            </Nav.Link>
          </Nav>

          <Nav className="ms-auto">
            <NavDropdown
              title={
                <div className="d-flex align-items-center">
                  <PersonCircle className="text-light me-2" size={28} />
                  <div className="text-start">
                    <span className="d-block h6 mb-0">
                      {user?.name || "Guest"}
                    </span>
                    <small className="text-muted">
                      {user?.email || "Not logged in"}
                    </small>
                  </div>
                </div>
              }
              id="user-nav-dropdown"
              menuVariant="dark"
              align="end"
              className="px-3"
            >
              <NavDropdown.Item href="/privateUserProfile" className="py-3">
                <PersonCircle className="me-3" size={20} />
                Profile
              </NavDropdown.Item>
              <NavDropdown.Item href="/settings" className="py-3">
                <Gear className="me-3" size={20} />
                Settings
              </NavDropdown.Item>
              <NavDropdown.Divider className="bg-secondary" />
              <NavDropdown.Item href="/logout" className="py-3 text-danger">
                <i className="fas fa-sign-out-alt me-3"></i>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
