import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import getUserInfo from "../../utilities/decodeJwt";
import axios from "axios";

const PrivateUserProfile = () => {
  const [user, setUser] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newRoute, setNewRoute] = useState({
    fromStation: "",
    toStation: "",
    routeName: ""
  });

  const [settings, setSettings] = useState({ name: "", password: "" });

  const [lines, setLines] = useState([]);
  const [fromStations, setFromStations] = useState([]);
  const [toStations, setToStations] = useState([]);
  const [fromLine, setFromLine] = useState("");
  const [toLine, setToLine] = useState("");
  const [editingRouteId, setEditingRouteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const raw = getUserInfo();
    if (!raw) return;
    const mapped = { _id: raw.userId, ...raw };
    setUser(mapped);
    setSettings({ name: mapped.name, password: "" });
    fetchFavoriteRoutes(mapped._id);
  }, []);

  const fetchFavoriteRoutes = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8081/api/favorite-routes/${userId}`);
      setUser(prev => ({
        ...prev,
        favoriteRoutes: response.data
      }));
    } catch (err) {
      console.error("Failed to fetch favorite routes:", err);
    }
  };

  const fetchLines = async () => {
    try {
      const response = await axios.get("https://api-v3.mbta.com/routes?filter[type]=0,1");
      const lineList = response.data.data.map(line => ({ id: line.id, name: line.attributes.long_name }));
      setLines(lineList);
    } catch (err) {
      console.error("Failed to fetch lines:", err);
    }
  };

  const fetchStationsForLine = async (lineId, target) => {
    try {
      const response = await axios.get(`https://api-v3.mbta.com/stops?filter[route]=${lineId}`);
      const stationList = response.data.data.map(stop => ({ id: stop.id, name: stop.attributes.name }));
      if (target === "from") setFromStations(stationList);
      else setToStations(stationList);
    } catch (err) {
      console.error("Failed to fetch stations for line:", err);
    }
  };

  const handleAddRoute = async () => {
    if (!newRoute.fromStation || !newRoute.toStation || !newRoute.routeName || !user?._id) {
      alert("Please fill all fields before saving.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:8081/api/favorite-routes/${user._id}`,
        newRoute
      );
      await fetchFavoriteRoutes(user._id);
      setNewRoute({ fromStation: "", toStation: "", routeName: "" });
      setFromLine("");
      setToLine("");
      setShowAddModal(false);
    } catch (err) {
      console.error("Failed to add route:", err);
      alert("Failed to save route. Check console for details.");
    }
  };

  const handleUpdateRoute = async () => {
    if (!newRoute.fromStation || !newRoute.toStation || !newRoute.routeName) {
      alert("Please fill all fields before updating.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:8081/api/favorite-routes/${user._id}/${editingRouteId}`,
        newRoute
      );
      await fetchFavoriteRoutes(user._id);
      setShowEditModal(false);
      setEditingRouteId(null);
      setNewRoute({ fromStation: "", toStation: "", routeName: "" });
    } catch (err) {
      console.error("Failed to update route:", err);
    }
  };

  const handleDeleteRoute = async (routeId) => {
    try {
      await axios.delete(`http://localhost:8081/api/favorite-routes/${user._id}/${routeId}`);
      await fetchFavoriteRoutes(user._id);
    } catch (err) {
      console.error("Failed to delete route:", err);
    }
  };


  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const openAddModal = () => {
    fetchLines();
    setShowAddModal(true);
  };

  const startEditing = (route) => {
    setEditingRouteId(route._id);
    setNewRoute({
      fromStation: route.fromStation,
      toStation: route.toStation,
      routeName: route.routeName
    });
    fetchLines();
  };

  if (!user) return <div><h4>Log in to view this page.</h4></div>;

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
      <div style={{ 
        background: "#fff", 
        padding: "30px", 
        borderRadius: "20px", 
        width: "400px", 
        textAlign: "center", 
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
      }}>
        <div style={{ 
          width: "100px", 
          height: "100px", 
          borderRadius: "50%", 
          backgroundColor: "#0d6efd", 
          color: "white", 
          margin: "auto", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          fontSize: "32px" 
        }}>
          {user?.name?.[0] || "U"}
        </div>
        <h4 className="mt-3">{user.name}</h4>
        <p className="text-muted">@{user.username}</p>

        <div className="mt-4" style={{ 
          border: "1px solid #eee",
          borderRadius: "10px",
          padding: "15px",
          minHeight: "200px",
          display: "flex",
          flexDirection: "column"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h5 style={{ marginBottom: "15px" }}>Favorite Routes</h5>
          </div>
          
          <div style={{ flexGrow: 1, overflowY: "auto", marginBottom: "15px" }}>
            {user.favoriteRoutes?.length > 0 ? (
              <div className="list-group">
                {user.favoriteRoutes.map(route => (
                  <div key={route._id} 
                    className="list-group-item d-flex justify-content-between align-items-center"
                    style={{ marginBottom: "8px", borderRadius: "5px" }}>
                    <div>
                      <strong>{route.routeName}</strong><br />
                      <small>{route.fromStation} → {route.toStation}</small>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">No favorite routes yet. Click 'Add Route' to get started!</p>
            )}
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <Button variant="primary" onClick={openAddModal} style={{ flex: 1 }}>
              Add Route
            </Button>
            <Button 
              variant="outline-primary" 
              onClick={() => setShowEditModal(true)}
              style={{ flex: 1 }}
              disabled={!user.favoriteRoutes?.length}>
              Edit Routes
            </Button>
          </div>
        </div>

        <div className="mt-3">
          <Button className="ms-2" variant="warning" onClick={() => setShowLogout(true)}>Log Out</Button>
        </div>

        {/* Add Route Modal */}
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Favorite Route</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <label>From Line</label>
            <select 
              className="form-control mb-2" 
              value={fromLine} 
              onChange={(e) => {
                setFromLine(e.target.value);
                fetchStationsForLine(e.target.value, "from");
              }}
            >
              <option value="">Select Line</option>
              {lines.map(line => (
                <option key={line.id} value={line.id}>{line.name}</option>
              ))}
            </select>

            <label>From Station</label>
            <select 
              className="form-control mb-2" 
              value={newRoute.fromStation} 
              onChange={(e) => setNewRoute({ ...newRoute, fromStation: e.target.value })}
            >
              <option value="">Select Station</option>
              {fromStations.map(station => (
                <option key={station.id} value={station.name}>{station.name}</option>
              ))}
            </select>

            <label>To Line</label>
            <select 
              className="form-control mb-2" 
              value={toLine} 
              onChange={(e) => {
                setToLine(e.target.value);
                fetchStationsForLine(e.target.value, "to");
              }}
            >
              <option value="">Select Line</option>
              {lines.map(line => (
                <option key={line.id} value={line.id}>{line.name}</option>
              ))}
            </select>

            <label>To Station</label>
            <select 
              className="form-control mb-2" 
              value={newRoute.toStation} 
              onChange={(e) => setNewRoute({ ...newRoute, toStation: e.target.value })}
            >
              <option value="">Select Station</option>
              {toStations.map(station => (
                <option key={station.id} value={station.name}>{station.name}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Route Name"
              className="form-control"
              value={newRoute.routeName}
              onChange={(e) => setNewRoute({ ...newRoute, routeName: e.target.value })}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleAddRoute}>
              Save Route
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Edit Routes Modal */}
        <Modal show={showEditModal} onHide={() => {
          setShowEditModal(false);
          setEditingRouteId(null);
        }}>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingRouteId ? "Edit Route" : "Manage Routes"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {editingRouteId ? (
              <div>
                <label>From Line</label>
                <select 
                  className="form-control mb-2" 
                  value={fromLine} 
                  onChange={(e) => {
                    setFromLine(e.target.value);
                    fetchStationsForLine(e.target.value, "from");
                  }}
                >
                  <option value="">Select Line</option>
                  {lines.map(line => (
                    <option key={line.id} value={line.id}>{line.name}</option>
                  ))}
                </select>

                <label>From Station</label>
                <select 
                  className="form-control mb-2" 
                  value={newRoute.fromStation} 
                  onChange={(e) => setNewRoute({ ...newRoute, fromStation: e.target.value })}
                >
                  <option value="">Select Station</option>
                  {fromStations.map(station => (
                    <option key={station.id} value={station.name}>{station.name}</option>
                  ))}
                </select>

                <label>To Line</label>
                <select 
                  className="form-control mb-2" 
                  value={toLine} 
                  onChange={(e) => {
                    setToLine(e.target.value);
                    fetchStationsForLine(e.target.value, "to");
                  }}
                >
                  <option value="">Select Line</option>
                  {lines.map(line => (
                    <option key={line.id} value={line.id}>{line.name}</option>
                  ))}
                </select>

                <label>To Station</label>
                <select 
                  className="form-control mb-2" 
                  value={newRoute.toStation} 
                  onChange={(e) => setNewRoute({ ...newRoute, toStation: e.target.value })}
                >
                  <option value="">Select Station</option>
                  {toStations.map(station => (
                    <option key={station.id} value={station.name}>{station.name}</option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Route Name"
                  className="form-control"
                  value={newRoute.routeName}
                  onChange={(e) => setNewRoute({ ...newRoute, routeName: e.target.value })}
                />
              </div>
            ) : (
              <div className="list-group">
                {user.favoriteRoutes?.map(route => (
                  <div 
                    key={route._id} 
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <strong>{route.routeName}</strong><br />
                      <small>{route.fromStation} → {route.toStation}</small>
                    </div>
                    <div>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => startEditing(route)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteRoute(route._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            {editingRouteId ? (
              <>
                <Button variant="secondary" onClick={() => setEditingRouteId(null)}>
                  Cancel Edit
                </Button>
                <Button variant="primary" onClick={handleUpdateRoute}>
                  Save Changes
                </Button>
              </>
            ) : (
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Close
              </Button>
            )}
          </Modal.Footer>
        </Modal>

        {/* Logout Modal */}
        <Modal show={showLogout} onHide={() => setShowLogout(false)} backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>Log Out</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to log out?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowLogout(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleLogout}>
              Yes, Log Out
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default PrivateUserProfile;