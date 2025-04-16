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
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settings, setSettings] = useState({ name: "", lastName: "", currentPassword: "", newPassword: "" });

  const [lines, setLines] = useState([]);
  const [fromLine, setFromLine] = useState("");
  const [toLine, setToLine] = useState("");
  const [fromStations, setFromStations] = useState([]);
  const [toStations, setToStations] = useState([]);

  const [newRoute, setNewRoute] = useState({ fromStation: "", toStation: "", routeName: "" });
  const [savedRoutes, setSavedRoutes] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = getUserInfo();
    setUser(userInfo);
    setSettings({ name: userInfo.name, lastName: userInfo.lastname || "", currentPassword: "", newPassword: "" });

    const saved = JSON.parse(localStorage.getItem("savedRoutes")) || [];
    setSavedRoutes(saved);

    fetchLines();
  }, []);

  const fetchLines = async () => {
    try {
      const res = await axios.get("https://api-v3.mbta.com/routes?filter[type]=0,1");
      const lines = res.data.data.map(route => ({ id: route.id, name: route.attributes.long_name }));
      setLines(lines);
    } catch (err) {
      console.error("Failed to fetch lines:", err);
    }
  };

  const fetchStationsForLine = async (lineId, target) => {
    try {
      const res = await axios.get(`https://api-v3.mbta.com/stops?filter[route]=${lineId}`);
      const stations = res.data.data.map(stop => ({ id: stop.id, name: stop.attributes.name }));
      if (target === "from") setFromStations(stations);
      else setToStations(stations);
    } catch (err) {
      console.error("Failed to fetch stations:", err);
    }
  };

  const handleAddRoute = () => {
    if (!newRoute.fromStation || !newRoute.toStation || !newRoute.routeName) return;

    const updatedRoutes = [...savedRoutes, newRoute];
    setSavedRoutes(updatedRoutes);
    localStorage.setItem("savedRoutes", JSON.stringify(updatedRoutes));

    setNewRoute({ fromStation: "", toStation: "", routeName: "" });
    setFromLine("");
    setToLine("");
    setShowAddModal(false);
  };

  const handleDeleteRoute = (indexToDelete) => {
    const updated = savedRoutes.filter((_, i) => i !== indexToDelete);
    setSavedRoutes(updated);
    localStorage.setItem("savedRoutes", JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleSettingsSave = () => {
    setUser(prev => ({ ...prev, name: settings.name, lastname: settings.lastName }));
    setShowSettingsModal(false);
    // Optionally update password logic here if desired
  };

  if (!user) return <div><h4>Log in to view this page.</h4></div>;

  return (
    <div className="d-flex justify-content-center mt-4">
      <div className="bg-white p-4 rounded-4 shadow" style={{ width: "400px" }}>
        <div className="mx-auto rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: 100, height: 100, fontSize: 32 }}>
          {user?.name?.[0] || "U"}
        </div>
        <h4 className="mt-3">{user.name} {user.lastname}</h4>
        <p className="text-muted">@{user.username}</p>

        <div className="mt-4 text-start">
          <h5>Saved Routes</h5>
          {savedRoutes.length > 0 ? (
            <ul className="list-unstyled">
              {savedRoutes.map((route, index) => (
                <li key={index} className="mb-2 p-2 bg-light rounded shadow-sm">
                  <strong>{route.routeName}</strong><br />
                  {route.fromStation} → {route.toStation}
                  <Button size="sm" variant="outline-danger" className="ms-2" onClick={() => handleDeleteRoute(index)}>Delete</Button>
                </li>
              ))}
            </ul>
          ) : <p>No routes saved.</p>}
        </div>

        <div className="mt-3">
          <Button onClick={() => setShowAddModal(true)}>Add Route</Button>
        </div>

        <Button className="mt-3" variant="info" onClick={() => setShowSettingsModal(true)}>Settings</Button>
        <Button className="mt-3 ms-2" variant="warning" onClick={() => setShowLogout(true)}>Log Out</Button>

        {/* Add Modal */}
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
          <Modal.Header closeButton><Modal.Title>Add Route</Modal.Title></Modal.Header>
          <Modal.Body>
            <label>From Line</label>
            <select className="form-control mb-2" value={fromLine} onChange={(e) => { setFromLine(e.target.value); fetchStationsForLine(e.target.value, "from"); }}>
              <option value="">Select Line</option>
              {lines.map(line => <option key={line.id} value={line.id}>{line.name}</option>)}
            </select>

            <label>From Station</label>
            <select className="form-control mb-2" value={newRoute.fromStation} onChange={(e) => setNewRoute({ ...newRoute, fromStation: e.target.value })}>
              <option value="">Select Station</option>
              {fromStations.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>

            <label>To Line</label>
            <select className="form-control mb-2" value={toLine} onChange={(e) => { setToLine(e.target.value); fetchStationsForLine(e.target.value, "to"); }}>
              <option value="">Select Line</option>
              {lines.map(line => <option key={line.id} value={line.id}>{line.name}</option>)}
            </select>

            <label>To Station</label>
            <select className="form-control mb-2" value={newRoute.toStation} onChange={(e) => setNewRoute({ ...newRoute, toStation: e.target.value })}>
              <option value="">Select Station</option>
              {toStations.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>

            <input type="text" placeholder="Label (e.g. Work)" className="form-control" value={newRoute.routeName} onChange={(e) => setNewRoute({ ...newRoute, routeName: e.target.value })} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Close</Button>
            <Button variant="primary" onClick={handleAddRoute}>Save</Button>
          </Modal.Footer>
        </Modal>

        {/* Settings Modal */}
        <Modal show={showSettingsModal} onHide={() => setShowSettingsModal(false)}>
          <Modal.Header closeButton><Modal.Title>Update Profile</Modal.Title></Modal.Header>
          <Modal.Body>
            <input type="text" placeholder="First Name" className="form-control mb-2" value={settings.name} onChange={(e) => setSettings({ ...settings, name: e.target.value })} />
            <input type="text" placeholder="Last Name" className="form-control mb-2" value={settings.lastName} onChange={(e) => setSettings({ ...settings, lastName: e.target.value })} />
            <input type="password" placeholder="Current Password" className="form-control mb-2" value={settings.currentPassword} onChange={(e) => setSettings({ ...settings, currentPassword: e.target.value })} />
            <input type="password" placeholder="New Password" className="form-control" value={settings.newPassword} onChange={(e) => setSettings({ ...settings, newPassword: e.target.value })} />
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