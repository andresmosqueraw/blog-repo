import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { register, reset } from '../redux/auth/authSlice';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });
  const [errors, setErrors] = useState({});

  const { name, email, password, password2 } = formData;
  const { error } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(reset());
    }
  }, [error, dispatch]);

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const errors = {};

    if (!name.trim()) {
      errors.name = 'Name is required';
    }

    if (!email) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      errors.email = 'Invalid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (password !== password2) {
      errors.password2 = 'Passwords do not match';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      dispatch(
        register({
          name,
          email,
          password,
        })
      );
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create an account</h1>
          <p className="mt-2 text-gray-600">Join our community of writers</p>
        </div>
        
        <form className="space-y-6" onSubmit={onSubmit}>
          <div>
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={onChange}
              className={`form-input ${errors.name ? 'border-error-500' : ''}`}
              placeholder="Your name"
            />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={onChange}
              className={`form-input ${errors.email ? 'border-error-500' : ''}`}
              placeholder="your@email.com"
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={onChange}
              className={`form-input ${errors.password ? 'border-error-500' : ''}`}
              placeholder="••••••••"
            />
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="password2" className="form-label">
              Confirm Password
            </label>
            <input
              id="password2"
              name="password2"
              type="password"
              autoComplete="new-password"
              value={password2}
              onChange={onChange}
              className={`form-input ${errors.password2 ? 'border-error-500' : ''}`}
              placeholder="••••••••"
            />
            {errors.password2 && <p className="form-error">{errors.password2}</p>}
          </div>

          <div>
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading['auth/register']}
            >
              {loading['auth/register'] ? (
                <span className="flex justify-center items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create account'
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Register;