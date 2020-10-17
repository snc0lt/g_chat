import React, { useState } from 'react'
import { Row, Col, Form, Button } from "react-bootstrap";
import { gql, useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';

const REGISTER_USER = gql`
  mutation register($username: String! $email: String! $password: String! $confirmPassword: String!) {
    register(username: $username email: $email password: $password confirmPassword: $confirmPassword) {
      username email createdAt
    }
  }
`;
const Register = (props) => {
  const [variables, setVariables] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, __){
      props.history.push('/login')
    },
    onError(err){
      setErrors(err.graphQLErrors[0].extensions.errors)
    }
  });
  const handleChange = (e) => {
    setVariables({
      ...variables,
      [e.target.name]:e.target.value
    })
  }

  const onSubmitRegister = (e) => {
    e.preventDefault()
    registerUser({ variables })
  }
  return (
    <Row className='bg-white py-5 justify-content-center'>
        <Col sm={8} md={6} lg={4}>
          <h1 className='text-center'>Register</h1>
          <Form onSubmit={onSubmitRegister}>
            <Form.Group>
              <Form.Label className={errors.username && 'text-danger'}>{errors.username ?? 'Username'}</Form.Label>
              <Form.Control className={errors.username && 'is-invalid'} type="text" name='username' value={variables.username} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label className={errors.email && 'text-danger'}>{errors.email ?? 'Email address'}</Form.Label>
              <Form.Control className={errors.email && 'is-invalid'} type="email" name='email' value={variables.email} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label className={errors.password && 'text-danger'}>{errors.password ?? 'Password'}</Form.Label>
              <Form.Control className={errors.password && 'is-invalid'} type="password" name='password' value={variables.password} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label className={errors.confirmPassword && 'text-danger'}>{errors.confirmPassword ?? 'Confirm Password'}</Form.Label>
              <Form.Control className={errors.confirmPassword && 'is-invalid'} type="password" name='confirmPassword' value={variables.confirmPassword} onChange={handleChange} />
            </Form.Group>
            <div className="text-center">
              <Button variant="success" type="submit" disabled={loading}>
                {loading ? 'loading...' : 'Register'}
            </Button>
            <br/>
            <small>Already have an account? <Link to='/login'>Login</Link></small>
            </div>
          </Form>
        </Col>
      </Row>
  )
}

export default Register
