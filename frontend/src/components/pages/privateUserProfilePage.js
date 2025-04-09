import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import getUserInfo from "../../utilities/decodeJwt";
import axios from "axios";

const PrivateUserProfile = () => {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState(null);
  const [newRoute, setNewRoute] = useState("");
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const fetchUserInfo = () => {
    const userInfo = getUserInfo();
    setUser(userInfo);
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleAddRoute = async () => {
    if (!newRoute.trim()) return;
    try {
      await axios.post(`http://localhost:8081/api/users/addFavoriteRoute/${user.id}`, {
        route: newRoute,
      });
      setUser((prev) => ({
        ...prev,
        favoriteRoutes: [...prev.favoriteRoutes, newRoute],
      }));
      setNewRoute("");
    } catch (err) {
      console.error("Failed to add route:", err);
    }
  };

  const handleRemoveRoute = async (routeToRemove) => {
    try {
      await axios.post(`http://localhost:8081/api/users/removeFavoriteRoute/${user.id}`, {
        route: routeToRemove,
      });
      setUser((prev) => ({
        ...prev,
        favoriteRoutes: prev.favoriteRoutes.filter((r) => r !== routeToRemove),
      }));
    } catch (err) {
      console.error("Failed to remove route:", err);
    }
  };

  if (!user) {
    return (
      <div>
        <h4>Log in to view this page.</h4>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="col-md-12 text-center">
        <h2>User Profile</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Last Name:</strong> {user.lastname}</p>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>

        <h4 className="mt-4">Favorite Routes</h4>
        {user.favoriteRoutes && user.favoriteRoutes.length > 0 ? (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {user.favoriteRoutes.map((route, index) => (
              <li key={index} className="mb-2">
                🚇 {route} &nbsp;
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemoveRoute(route)}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No favorite routes yet.</p>
        )}

        <div className="mt-3">
          <input
            type="text"
            placeholder="New favorite route"
            value={newRoute}
            onChange={(e) => setNewRoute(e.target.value)}
          />
          <Button className="ms-2" onClick={handleAddRoute}>
            Add Route
          </Button>
        </div>

        <Button className="mt-4" variant="warning" onClick={handleShow}>
          Log Out
        </Button>

        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
          <Modal.Header closeButton>
            <Modal.Title>Log Out</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to Log Out?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleLogout}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default PrivateUserProfile;
