 //src/components/authentication/Login.js

import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify"


export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();
  
    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
  
      toast.success("Logged in successfully!"); // ✅ Toast on success
      history.push("/");
    } catch {
      setError("Failed to log in");
      toast.error("Login failed. Please check your credentials."); // ✅ Toast on failure
    }
  
    setLoading(false);
  }
  

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh", backgroundColor: "#fff" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        {/* Title */}
        <h1
          className="text-center mb-4"
          style={{
            color: "#007bff",
            fontWeight: "bold",
            fontSize: "2.5rem",
            letterSpacing: "1px",
          }}
        >
          CloudSync
        </h1>

        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Log In</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef} required />
              </Form.Group>
              <Form.Group id="password" className="mt-2">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" ref={passwordRef} required />
              </Form.Group>
              <Button disabled={loading} className="w-100 mt-4" type="submit">
                Log In
              </Button>
            </Form>
            <div className="w-100 text-center mt-3">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
          </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
          Need an account? <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    </Container>
  );
}
