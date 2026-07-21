import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // HANDLE SIGNUP
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await API.post("/auth/signup", formData);

      setSuccess(
        response.data?.message || "Account created successfully!"
      );

      // Redirect to login after successful signup
      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (err) {
      console.error("Signup Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8">

        {/* LOGO */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            Finora
          </h1>

          <p className="text-slate-400 mt-2">
            AI Financial Risk & Credit Intelligence
          </p>
        </div>

        <h2 className="text-2xl font-semibold text-white mb-6">
          Create Account
        </h2>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg mb-5">
            {error}
          </div>
        )}

        {/* SUCCESS MESSAGE */}
        {success && (
          <div className="bg-green-500/10 border border-green-500 text-green-400 p-3 rounded-lg mb-5">
            {success}
          </div>
        )}

        {/* SIGNUP FORM */}
        <form onSubmit={handleSubmit}>

          {/* NAME */}
          <div className="mb-4">
            <label className="block text-slate-300 mb-2">
              Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* EMAIL */}
          <div className="mb-4">
            <label className="block text-slate-300 mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-6">
            <label className="block text-slate-300 mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Minimum 6 characters"
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* SIGNUP BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        {/* LOGIN LINK */}
        <p className="text-center text-slate-400 mt-6">
          Already have an account?{" "}

          <Link
            to="/login"
            className="text-blue-400 hover:text-blue-300"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

// THIS IS REQUIRED BECAUSE App.jsx USES:
// import Signup from "./pages/Signup";

export default Signup;