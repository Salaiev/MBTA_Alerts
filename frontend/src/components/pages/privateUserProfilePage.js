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
  const [showSettingsModal, setShowSettingsModal] = useState(false);
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
  const navigate = useNavigate();

  useEffect(() => {
    const raw = getUserInfo();
    if (!raw) return;
    // <-- here’s the fix: pull the real userId field
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
  if (!newRoute.fromStation || !newRoute.toStation || !newRoute.routeName || !user || !user._id) {
    alert("Please fill all fields before saving.");
    return;
  }

  console.log("Submitting new route:", newRoute);
  console.log("Submitting for user ID:", user._id);

  try {
    const response = await axios.post(
      `http://localhost:8081/api/favorite-routes/${user._id}`,
      newRoute
    );
    console.log("Route saved successfully:", response.data);
    await fetchFavoriteRoutes(user._id);
    setNewRoute({ fromStation: "", toStation: "", routeName: "" });
    setFromLine("");
    setToLine("");
    setShowAddModal(false);
  } catch (err) {
    console.error("Failed to add route:", err.response?.data || err.message);
    alert("Failed to save route. Check console for details.");
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

  const handleSettingsSave = () => {
    setUser(prev => ({ ...prev, name: settings.name }));
    setShowSettingsModal(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const openAddModal = () => {
    fetchLines();
    setShowAddModal(true);
  };

  if (!user) return <div><h4>Log in to view this page.</h4></div>;

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
      <div style={{ background: "#fff", padding: "30px", borderRadius: "20px", width: "400px", textAlign: "center", boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}>
        <div style={{ width: "100px", height: "100px", borderRadius: "50%", backgroundColor: "#0d6efd", color: "white", margin: "auto", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px" }}>
          {user?.name?.[0] || "U"}
        </div>
        <h4 className="mt-3">{user.name}</h4>
        <p className="text-muted">@{user.username}</p>

        <div className="mt-4" style={{ textAlign: "left" }}>
          <h5>Favorite Routes</h5>
          {user.favoriteRoutes && user.favoriteRoutes.length > 0 ? (
            <ul className="list-unstyled">
              {user.favoriteRoutes.map(route => (
                <li key={route._id} className="mb-2 p-2 bg-light rounded shadow-sm">
                  <strong>{route.routeName}</strong><br />
                  {route.fromStation} → {route.toStation}
                </li>
              ))}
            </ul>
          ) : <p>No favorite routes yet.</p>}
        </div>

        <div className="mt-3">
          <Button className="me-2" onClick={openAddModal}>Add Route</Button>
          <Button variant="outline-secondary" onClick={() => setShowEditModal(true)}>Edit Routes</Button>
        </div>

        <Button className="mt-3" variant="info" onClick={() => setShowSettingsModal(true)}>Settings</Button>
        <Button className="mt-3 ms-2" variant="warning" onClick={() => setShowLogout(true)}>Log Out</Button>

        {/* Add Modal */}
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
          <Modal.Header closeButton><Modal.Title>Add Favorite Route</Modal.Title></Modal.Header>
          <Modal.Body>
            <label>From Line</label>
            <select className="form-control mb-2" value={fromLine} onChange={(e) => { setFromLine(e.target.value); fetchStationsForLine(e.target.value, "from"); }}>
              <option value="">Select Line</option>
              {lines.map(line => (
                <option key={line.id} value={line.id}>{line.name}</option>
              ))}
            </select>
            <label>From Station</label>
            <select className="form-control mb-2" value={newRoute.fromStation} onChange={(e) => setNewRoute({ ...newRoute, fromStation: e.target.value })}>
              <option value="">Select Station</option>
              {fromStations.map(station => (
                <option key={station.id} value={station.name}>{station.name}</option>
              ))}
            </select>

            <label>To Line</label>
            <select className="form-control mb-2" value={toLine} onChange={(e) => { setToLine(e.target.value); fetchStationsForLine(e.target.value, "to"); }}>
              <option value="">Select Line</option>
              {lines.map(line => (
                <option key={line.id} value={line.id}>{line.name}</option>
              ))}
            </select>
            <label>To Station</label>
            <select className="form-control mb-2" value={newRoute.toStation} onChange={(e) => setNewRoute({ ...newRoute, toStation: e.target.value })}>
              <option value="">Select Station</option>
              {toStations.map(station => (
                <option key={station.id} value={station.name}>{station.name}</option>
              ))}
            </select>

            <input type="text" placeholder="Label Name (e.g., Work)" className="form-control" value={newRoute.routeName} onChange={(e) => setNewRoute({ ...newRoute, routeName: e.target.value })} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Close</Button>
            <Button variant="primary" onClick={handleAddRoute}>Save</Button>
          </Modal.Footer>
        </Modal>

        {/* Edit Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton><Modal.Title>Edit/Delete Favorite Routes</Modal.Title></Modal.Header>
          <Modal.Body>
            {user.favoriteRoutes && user.favoriteRoutes.map(route => (
              <div key={route._id} className="mb-3 p-2 border rounded">
                <div><strong>{route.routeName}</strong></div>
                <div>{route.fromStation} → {route.toStation}</div>
                <Button variant="danger" size="sm" className="mt-2" onClick={() => handleDeleteRoute(route._id)}>Delete</Button>
              </div>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
          </Modal.Footer>
        </Modal>

        {/* Settings Modal */}
        <Modal show={showSettingsModal} onHide={() => setShowSettingsModal(false)}>
          <Modal.Header closeButton><Modal.Title>Update Profile</Modal.Title></Modal.Header>
          <Modal.Body>
            <input type="text" placeholder="Name" className="form-control mb-2" value={settings.name} onChange={(e) => setSettings({ ...settings, name: e.target.value })} />
            <input type="password" placeholder="New Password" className="form-control" value={settings.password} onChange={(e) => setSettings({ ...settings, password: e.target.value })} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowSettingsModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSettingsSave}>Save Changes</Button>
          </Modal.Footer>
        </Modal>

        {/* Logout Modal */}
        <Modal show={showLogout} onHide={() => setShowLogout(false)} backdrop="static" keyboard={false}>
          <Modal.Header closeButton>
            <Modal.Title>Log Out</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to log out?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowLogout(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleLogout}>Yes</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default PrivateUserProfile;
