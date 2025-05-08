import React, { useEffect, useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import getUserInfo from "../../utilities/decodeJwt";

const SettingsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
  });
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const user = getUserInfo();
    if (user) {
      setFormData({
        name: user.name || "",
        lastname: user.lastname || "",
        email: user.email || "",
        password: "",
      });
      setUserId(user.userId); // ⚠️ ensure your token has userId
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

    if (formData.password && !validatePassword(formData.password)) {
      setError("Password must be at least 6 characters and include letters and numbers.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:8081/api/users/updateUserById/${userId}`,
        formData
      );
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError("Failed to update profile.");
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

        <Button variant="success" type="submit">
          Update Profile
        </Button>
      </Form>
    </Container>
  );
};

export default SettingsPage;
