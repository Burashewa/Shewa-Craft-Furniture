import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function SignUp() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordMismatch =
    password !== "" && confirmPassword !== "" && password !== confirmPassword;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwordMismatch) return;
    // TODO: handle sign up (API call)
    console.log({ fullName, email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-3xl font-semibold text-gray-900 mb-6 text-center">
          Create Account
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full name"
            className="w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email address"
            className="w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm password"
            className="w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          { passwordMismatch && (
            <p className="text-red-500 text-xs mt-2">
              Passwords do not match
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gray-900 text-white hover:bg-gray-800 transition"
            disabled={passwordMismatch}
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-4">
          Already have an account?{" "}
          <Link to="/auth/signin" className="text-gray-900 font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
