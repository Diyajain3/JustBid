import React, { useState } from "react";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };

  const handleGithubLogin = () => {
    console.log("GitHub login clicked");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-white px-4">

      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-purple-100 rounded-2xl shadow-lg shadow-purple-100/40 p-8">

        {/* Toggle */}
        <div className="flex mb-8 bg-purple-50 rounded-lg p-1 border border-purple-100">

          <button
            onClick={() => setIsLogin(true)}
            className={`w-1/2 py-2 rounded-md text-sm font-semibold transition ${
              isLogin
                ? "bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-sm"
                : "text-slate-500"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setIsLogin(false)}
            className={`w-1/2 py-2 rounded-md text-sm font-semibold transition ${
              !isLogin
                ? "bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-sm"
                : "text-slate-500"
            }`}
          >
            Sign Up
          </button>

        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
          {isLogin ? "Welcome Back 👋" : "Create Account 🚀"}
        </h2>

        {/* Social Login */}
        <div className="space-y-3 mb-6">

          {/* Google */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-purple-50 text-slate-700 py-3 rounded-lg font-semibold border border-purple-100 transition"
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
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-purple-50 text-slate-700 py-3 rounded-lg font-semibold border border-purple-100 transition"
          >
            <img
              src="https://www.svgrepo.com/show/512317/github-142.svg"
              alt="github"
              className="w-5 h-5"
            />
            Continue with GitHub
          </button>

        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-purple-100"></div>
          <span className="text-slate-400 text-sm">or</span>
          <div className="flex-1 h-px bg-purple-100"></div>
        </div>

        {/* Form */}
        <form className="space-y-4">

          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 rounded-lg bg-white border border-purple-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-white border border-purple-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-300"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-white border border-purple-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-300"
          />

          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full p-3 rounded-lg bg-white border border-purple-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          )}

          {isLogin && (
            <div className="text-right text-sm text-purple-500 cursor-pointer hover:text-purple-600">
              Forgot Password?
            </div>
          )}

          <button className="w-full bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-400 hover:to-fuchsia-400 text-white py-3 rounded-lg font-semibold transition shadow-md shadow-purple-200 active:scale-95">
            {isLogin ? "Login" : "Sign Up"}
          </button>

        </form>

        {/* Bottom */}
        <p className="text-center text-sm text-slate-500 mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-purple-500 ml-1 cursor-pointer font-medium hover:text-purple-600"
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>

      </div>
    </div>
  );
}