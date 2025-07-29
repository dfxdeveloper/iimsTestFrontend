import { motion } from "framer-motion";
import { FaEnvelope } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";


const ForgetPassword = () => {
    const navigate = useNavigate()
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/verify-otp')
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Logo Section */}
      <div className="w-full py-4 sm:py-6 md:py-8 px-4 sm:px-6">
        <Link to='/' className="flex items-center justify-center">
          <img src="assets/logo.svg" alt="Catex Overseas" className="h-8 sm:h-10 md:h-12" />
        </Link>
      </div>

      <hr className="border border-[#BCC1CA]"/>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 md:py-24">
        <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          {/* Left Side (Illustration) - Hidden on mobile */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden md:flex md:w-1/2 items-center justify-center"
          >
            <img 
              src="assets/login-image.webp" 
              alt="Reset Password" 
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
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">Forgot Your Password?</h2>
              <p className="text-sm text-[#9095A0]">nter your registered email address below, and we'll send you a link to reset your password.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="relative flex items-center">
                <FaEnvelope className="absolute left-4 text-gray-400 text-lg" />
                <input
                  type="email"
                  placeholder="What is your e-mail?"
                  className="w-full pl-12 pr-4 h-11 sm:h-12 flex items-center text-base rounded-full border border-gray-300 bg-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-[#636AE8] text-white py-3 sm:py-3.5 rounded-full hover:bg-indigo-600 transition text-sm sm:text-base font-medium"
              >
                Send
              </motion.button>

              <div className="text-center">
                <Link 
                  to="/login" 
                  className="text-[#636AE8] text-sm hover:underline"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;