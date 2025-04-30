import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const PRIMARY_COLOR = "#cc5c99";
const SECONDARY_COLOR = "#0c0c1f";
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
  const [light, setLight] = useState(false);
  const [bgColor, setBgColor] = useState(SECONDARY_COLOR);
  const [bgText, setBgText] = useState("Light Mode");

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  useEffect(() => {
    if (light) {
      setBgColor("white");
      setBgText("Dark mode");
    } else {
      setBgColor(SECONDARY_COLOR);
      setBgText("Light mode");
    }
  }, [light]);

  let labelStyling = {
    color: PRIMARY_COLOR,
    fontWeight: "bold",
    textDecoration: "none",
  };
  let backgroundStyling = { background: bgColor };
  let buttonStyling = {
    background: PRIMARY_COLOR,
    borderStyle: "none",
    color: bgColor,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    <section className="vh-100">
      <div className="container-fluid h-custom vh-100">
        <div
          className="row d-flex justify-content-center align-items-center h-100"
          style={backgroundStyling}
        >
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            <Form>
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
                  />
                </Form.Group>
              ))}
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="flexSwitchCheckDefault"
                  onChange={() => {
                    setLight(!light);
                  }}
                />
                <label
                  className="form-check-label text-muted"
                  htmlFor="flexSwitchCheckDefault"
                >
                  {bgText}
                </label>
              </div>
              {error && (
                <div style={labelStyling} className="pt-3">
                  {error}
                </div>
              )}
              <Button
                variant="primary"
                type="submit"
                onClick={handleSubmit}
                style={buttonStyling}
                className="mt-2"
              >
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
