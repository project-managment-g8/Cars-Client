// client/src/screens/RegisterScreen.jsx
import React, { useState } from 'react';
import { Form, Button, Alert, ProgressBar, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../slices/authSlice';
import FormContainer from '../components/FormContainer';
import apiBaseUrl from '../constants';
import { toast } from 'react-toastify';

const RegisterScreen = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length > 7) strength += 2;
    if (password.match(/[A-Z]/)) strength += 2;
    if (password.match(/[a-z]/)) strength += 2;
    if (password.match(/[0-9]/)) strength += 2;
    if (password.match(/[^A-Za-z0-9]/)) strength += 2;
    setPasswordStrength(strength);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 8 || !password.match(/[A-Z]/) || !password.match(/[^A-Za-z0-9]/)) {
      toast.error('Password must be at least 8 characters long, contain at least one uppercase letter, and one symbol.');
      return;
    }
    try {
      const response = await axios.post(`${apiBaseUrl}/api/users/register`, {
        userName,
        email,
        password,
      });

      if (response.data.success) {
        dispatch(setUser(response.data));
        navigate(`/welcome`);
      } else {
        setErrorMessage(response.data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <FormContainer>
      <h1>Register</h1>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="userName" className="my-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="email" className="my-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="password" className="my-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              checkPasswordStrength(e.target.value);
            }}
          ></Form.Control>
          <ProgressBar
            now={(passwordStrength / 5) * 100}
            variant={passwordStrength > 2 ? 'success' : 'danger'}
            className="mt-2"
          />
        </Form.Group>
        <Form.Group controlId="confirmPassword" className="my-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type="submit" variant="primary" className="mt-2">
          Register
        </Button>
      </Form>
      <Row className="py-3">
        <Col>
          Already have an account? <Link to="/">Login</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
