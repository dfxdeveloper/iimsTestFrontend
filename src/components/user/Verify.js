import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";

const Verify = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);
const navigate = useNavigate()
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/reset-password')
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain");
    const pastedArray = pastedData.slice(0, 6).split("");
    
    if (pastedArray.every(char => !isNaN(char))) {
      setOtp(pastedArray.concat(new Array(6 - pastedArray.length).fill("")));
      if (inputRefs.current[5]) {
        inputRefs.current[5].focus();
      }
    }
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
              alt="Verification" 
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
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">Verification Code</h2>
              <p className="text-sm text-[#9095A0]">Enter the passcode you just received on your email address ending with ****@gmail.com</p>
            </div>
            
            <div className="space-y-6">
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    ref={(ref) => inputRefs.current[index] = ref}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-center text-xl border border-gray-300 rounded-lg bg-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                  />
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#636AE8] text-white py-3 sm:py-3.5 rounded-full hover:bg-indigo-600 transition text-sm sm:text-base font-medium"
                onClick={handleSubmit}
              >
                Verify
              </motion.button>

              <div className="text-center">
                <button 
                  className="text-[#636AE8] text-sm hover:underline"
                >
                  Resend?
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Verify;