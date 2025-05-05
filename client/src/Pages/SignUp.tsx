import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as authService from "../services/authService";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

// Function to handle form submission
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  
  // Validate form data
  if (!formData.fullname || !formData.email || !formData.password) {
    setError("All fields are required");
    return;
  }
  
  if (formData.password.length < 6) {
    setError("Password must be at least 6 characters long");
    return;
  }
  
  setError(null);
  setIsLoading(true);
  
  try {
    await authService.register(formData.fullname, formData.email, formData.password);
    navigate("/login");
  } catch (error: any) {
    console.error("Signup error:", error);
    if (error.response && error.response.data && error.response.data.message) {
      setError(error.response.data.message);
    } else {
      setError("An error occurred during signup. Please try again.");
    }
  } finally {
    setIsLoading(false);
  }
};
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-teal-600">Join JokeDiary</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              id="fullname"
              type="text"
              name="fullname"
              placeholder="Enter your full name"
              className="w-full p-3 border rounded-lg focus:ring-teal-500 focus:border-teal-500"
              onChange={handleChange}
              value={formData.fullname}
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full p-3 border rounded-lg focus:ring-teal-500 focus:border-teal-500"
              onChange={handleChange}
              value={formData.email}
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Create a password"
              className="w-full p-3 border rounded-lg focus:ring-teal-500 focus:border-teal-500"
              onChange={handleChange}
              value={formData.password}
              required
              minLength={6}
            />
            <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-teal-600 text-white p-3 rounded-lg hover:bg-teal-700 transition duration-200"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-teal-600 hover:underline font-medium">Log In</Link>
        </p>
      </div>
    </div>
    );
  };
  
  export default SignUp ;