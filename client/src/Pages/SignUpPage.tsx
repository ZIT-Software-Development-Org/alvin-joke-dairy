import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const history = useHistory(); // For redirection after successful signup

  // Update form data
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make the API call to your backend for signup
      const response = await axios.post('http://localhost:4000/api/signup', formData);

      // Handle successful signup (redirect, display message, etc.)
      if (response.data.success) {
        // Redirect to login page or dashboard
        history.push('/login');
      }
    } catch (err) {
      // Handle error (display message, etc.)
      console.error('Signup failed:', err);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-input"
              required
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-input"
              required
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              type="checkbox"
              className="form-checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            <label>Remember Me</label>
          </div>
          <button type="submit" className="submit-btn">
            Sign Up
          </button>
        </form>
        <p>
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
