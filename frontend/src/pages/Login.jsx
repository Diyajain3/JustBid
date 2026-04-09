import React, { useState } from "react";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);

  // 🔐 Social handlers (connect backend here later)
  const handleGoogleLogin = () => {
    console.log("Google login clicked");
    // integrate Firebase / OAuth here
  };

  const handleGithubLogin = () => {
    console.log("GitHub login clicked");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8">
        
        {/* Toggle */}
        <div className="flex mb-8 bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`w-1/2 py-2 rounded-md text-sm font-semibold ${
              isLogin ? "bg-blue-600 text-white" : "text-slate-400"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`w-1/2 py-2 rounded-md text-sm font-semibold ${
              !isLogin ? "bg-blue-600 text-white" : "text-slate-400"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          {isLogin ? "Welcome Back 👋" : "Create Account 🚀"}
        </h2>

        {/* Social Login */}
        <div className="space-y-3 mb-6">
          
          {/* Google */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          {/* GitHub */}
          <button
            onClick={handleGithubLogin}
            className="w-full flex items-center justify-center gap-3 bg-slate-800 text-white py-3 rounded-lg font-semibold hover:bg-slate-700 transition border border-slate-700"
          >
            <img
              src="https://www.svgrepo.com/show/512317/github-142.svg"
              alt="github"
              className="w-5 h-5 invert"
            />
            Continue with GitHub
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-slate-700"></div>
          <span className="text-slate-400 text-sm">or</span>
          <div className="flex-1 h-px bg-slate-700"></div>
        </div>

        {/* Form */}
        <form className="space-y-4">
          
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
          />

          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
            />
          )}

          {isLogin && (
            <div className="text-right text-sm text-blue-500 cursor-pointer">
              Forgot Password?
            </div>
          )}

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        {/* Bottom */}
        <p className="text-center text-sm text-slate-400 mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 ml-1 cursor-pointer"
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}