import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const PRIMARY_COLOR = "#0d6efd";
const SECONDARY_COLOR = "#ffffff";
const url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/api/users/signup`;

const Register = () => {
  const [data, setData] = useState({
    name: "",
    lastname: "",
    username: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [light, setLight] = useState(true);
  const [bgColor, setBgColor] = useState(SECONDARY_COLOR);
  const [bgText, setBgText] = useState("Dark mode");

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  useEffect(() => {
    if (light) {
      setBgColor(SECONDARY_COLOR);
      setBgText("Dark mode");
    } else {
      setBgColor("#0c0c1f");
      setBgText("Light mode");
    }
  }, [light]);

  const labelStyling = {
    color: PRIMARY_COLOR,
    fontWeight: "bold",
  };

  const buttonStyling = {
    backgroundColor: PRIMARY_COLOR,
    border: "none",
    color: "#fff",
    width: "100%",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { password } = data;

    const isValidPassword =
      password.length >= 6 &&
      /[A-Za-z]/.test(password) &&
      /\d/.test(password);

    if (!isValidPassword) {
      setError("Password must be at least 6 characters and include letters and numbers.");
      return;
    }

    try {
      const { data: res } = await axios.post(url, data);
      console.log("Signup success:", res);
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.error || "Registration failed");
      }
    }
  };

  return (
    <section className="vh-100" style={{ background: bgColor }}>
      <div className="container-fluid h-custom vh-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            <Form onSubmit={handleSubmit} className="p-4 rounded shadow" style={{ backgroundColor: "#f9f9f9" }}>
              <h3 className="text-center mb-4" style={{ color: PRIMARY_COLOR }}>Create Account</h3>

              {["name", "lastname", "username", "email", "password"].map((field, i) => (
                <Form.Group className="mb-3" controlId={`form${field}`} key={i}>
                  <Form.Label style={labelStyling}>
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </Form.Label>
                  <Form.Control
                    type={field === "password" ? "password" : "text"}
                    name={field}
                    onChange={handleChange}
                    placeholder={`Enter ${field}`}
                    required
                  />
                </Form.Group>
              ))}

              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="flexSwitchCheckDefault"
                  onChange={() => setLight(!light)}
                />
                <label className="form-check-label text-muted" htmlFor="flexSwitchCheckDefault">
                  {bgText}
                </label>
              </div>

              {error && (
                <div className="text-danger text-center mb-3" style={{ fontWeight: "bold" }}>
                  {error}
                </div>
              )}

              <Button type="submit" style={buttonStyling}>
                Register
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
