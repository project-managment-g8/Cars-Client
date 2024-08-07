// client/src/screens/LoginScreen.jsx
import React, { useState } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../slices/authSlice';
import FormContainer from '../components/FormContainer';
import { IoEyeOffOutline } from 'react-icons/io5';
import { FaRegEye } from 'react-icons/fa';
import apiBaseUrl from '../constants';


const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${apiBaseUrl}/api/users/login`, {
        email,
        password,
      });
      if (response.data.success) {
        dispatch(setUser(response.data));
        console.log(response.data);
        navigate(`/welcome?name=${response.data.userName}`); // Navigate to the welcome screen with the user's name
      } else {
        setErrorMessage(response.data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  const passwordChangeHandler = () => {
    setShowPassword(!showPassword);
  };

  const passwordType = () => {
    return showPassword ? 'text' : 'password';
  };

  return (
    <FormContainer>
      <h1>Sign In</h1>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <Form onSubmit={submitHandler}>
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
          <Form.Label onClick={passwordChangeHandler}>
            Password{' '}
            {showPassword ? (
              <FaRegEye className="mx-1" />
            ) : (
              <IoEyeOffOutline className="mx-1" />
            )}
          </Form.Label>
          <Form.Control
            type={passwordType()}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type="submit" variant="primary" className="mt-2">
          Sign in
        </Button>
      </Form>
      <Row className="py-3">
        <Col>
          Don't have an account?
          <Link to="/register"> Register</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
