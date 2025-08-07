import { motion } from "framer-motion";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../services/context/auth";
import { showToast, toastCustomConfig } from '../../services/config/toast';
import { api } from "../../services/config/axiosInstance";
import  { Toaster } from 'react-hot-toast';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: localStorage.getItem('email') || "",
    password: localStorage.getItem('password') || "",
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const validateEmail = (email) => {
    if (!email) {
      return "Please enter your email address";
    }
    
    if (!email.includes('@')) {
      return "Please enter a valid email address";
    }
    
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    
    return "";
  };

  const validatePassword = (password) => {
    if (!password) {
      return "Please enter your password";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    return "";
  };

  const validateForm = () => {
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    const newErrors = {
      email: emailError,
      password: passwordError
    };
    
    setErrors(newErrors);
    return !emailError && !passwordError;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    setIsLoading(true);
    
    try {
      await showToast.promise(
        api.post('/auth/login', {
          email: formData.email,
          password: formData.password,
        }),
        {
          loading: 'Logging in...',
          success: (response) => {
            if (formData.rememberMe) {
              localStorage.setItem('email', formData.email);
              localStorage.setItem('password', formData.password);
            } else {
              localStorage.removeItem('email');
              localStorage.removeItem('password');
            }
  
            login(response.data);
            setTimeout(() => {
              if (response.data.department === "master_admin") {
                navigate("/masteradmin/dashboard");
              } else if (response.data.department === "admin") {
                navigate("/admin/dashboard");
              }
              else if(response.data.department === "marketing"){
                navigate("/marketing/dashboard");
              }
               else if(response.data.department === "merchandise_marketing"){
                navigate("/merchandise/dashboard");
              }
              else if(response.data.department === "trims"){
                navigate("/trims/dashboard");
              }
              else if(response.data.department === "fabric"){
                navigate("/fabric/dashboard");
              }
              else if(response.data.department === "logistic"){
                navigate("/logistics/dashboard");
              }
              else if(response.data.department === "production"){
                navigate("/production/dashboard");
              }
              else {
                navigate('/');
              }
            }, 2000);
            
  
            return '👋 Welcome back!';
          },
          error: (error) => {
            setErrors(prev => ({
              ...prev,
              submit: error.message || 'An error occurred during login'
            }));
            return '❌ ' + (error.message || 'Login failed');
          }
        }
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
       <Toaster {...toastCustomConfig} />

      {/* Logo Section */}
      <div className="w-full py-4 sm:py-6 md:py-8 px-4 sm:px-6">
        <Link to="/" className="flex items-center justify-center">
          <img
            src="assets/logo.svg"
            alt="Catex Overseas"
            className="h-8 sm:h-10 md:h-12"
          />
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 md:py-24">
        <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          {/* Left Side (Illustration) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden md:flex md:w-1/2 items-center justify-center"
          >
            <img
              src="assets/login-image.webp"
              alt="LoginImage"
              className="w-full max-w-md object-contain"
            />
          </motion.div>

          {/* Right Side (Form) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2 max-w-[440px] bg-white shadow-lg rounded-lg p-6 sm:p-8 md:p-10 border border-gray-200"
          >
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
                Welcome
              </h2>
              <p className="text-sm text-[#9095A0]">Log in your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="space-y-1">
                <div className="relative flex items-center">
                  <FaEnvelope className="absolute left-4 text-gray-400 text-lg" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={() => {
                      const emailError = validateEmail(formData.email);
                      if (emailError) {
                        setErrors(prev => ({ ...prev, email: emailError }));
                      }
                    }}
                    placeholder="Enter your email address"
                    className={`w-full pl-12 pr-4 h-11 sm:h-12 flex items-center text-base rounded-full border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } bg-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm ml-4">{errors.email}</p>
                )}
              </div>

              <div className="space-y-1">
                <div className="relative flex items-center">
                  <FaLock className="absolute left-4 text-gray-400 text-lg" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className={`w-full pl-12 pr-12 h-11 sm:h-12 flex items-center text-base rounded-full border ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    } bg-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition`}
                  />
                  <button
                    type="button"
                    className="absolute right-4 text-gray-400 text-xl sm:text-2xl p-1"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm ml-4">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm text-[#171A1F]">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="mr-2 w-4 h-4 bg-[#4850E4] rounded border-[#4850E4]"
                  />
                  Remember me
                </label>
                <Link
                  to="/forget-password"
                  className="text-[#636AE8] text-sm hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {errors.submit && (
                <p className="text-red-500 text-sm text-center">{errors.submit}</p>
              )}

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#636AE8] text-white py-3 sm:py-3.5 rounded-full hover:bg-indigo-600 transition text-sm sm:text-base font-medium disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Logging in..." : "Login"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;