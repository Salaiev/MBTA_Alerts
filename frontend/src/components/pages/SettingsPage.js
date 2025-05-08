import React, { useEffect, useState } from "react";
import { Container, Form, Button, Alert, Modal } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import getUserInfo from "../../utilities/decodeJwt";

const SettingsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUserInfo();
    if (user) {
      setFormData({
        name: user.name || "",
        lastname: user.lastname || "",
        email: user.email || "",
        password: "",
      });
      setUserId(user.userId);
    }
  }, []);

  const validatePassword = (pw) => {
    return pw.length >= 6 && /[A-Za-z]/.test(pw) && /\d/.test(pw);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password) {
      if (!validatePassword(formData.password)) {
        setError("Password must be at least 6 characters and include letters and numbers.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }
    

    try {
      await axios.put(`http://localhost:8081/api/users/updateUserById/${userId}`, formData);
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError("Failed to update profile.");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`http://localhost:8081/api/users/deleteUser/${userId}`);
      localStorage.clear();
      setShowDeleteModal(false);
      navigate("/signup");
    } catch (err) {
      setError("Failed to delete account.");
      setShowDeleteModal(false);
    }
  };

  return (
    <Container style={{ maxWidth: "600px", marginTop: "40px" }}>
      <h3 className="mb-4">Update Profile</h3>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formName" className="mb-3">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formLastname" className="mb-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formEmail" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formPassword" className="mb-3">
  <Form.Label>New Password (optional)</Form.Label>
  <Form.Control
    type="password"
    name="password"
    placeholder="Leave blank to keep current password"
    value={formData.password}
    onChange={handleChange}
  />
</Form.Group>

<Form.Group controlId="formConfirmPassword" className="mb-3">
  <Form.Label>Confirm New Password</Form.Label>
  <Form.Control
    type="password"
    name="confirmPassword"
    placeholder="Re-enter new password"
    value={formData.confirmPassword}
    onChange={handleChange}
  />
</Form.Group>


        <div className="d-flex justify-content-between">
          <Button variant="success" type="submit">
            Update Profile
          </Button>
          <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
            Delete Account
          </Button>
        </div>
      </Form>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to permanently delete your account? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteAccount}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SettingsPage;
