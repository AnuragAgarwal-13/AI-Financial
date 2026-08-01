import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowUpRight } from "lucide-react";

import API from "../services/api";
import loginHero from "../assets/Login_hero.png";


function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // LOGIN
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      // Save JWT token
      localStorage.setItem("token", response.data.token);

      // Save logged-in user
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      // Go to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Login Error:", err);

      setError(
        err.response?.data?.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="finora-login-page">

      <div className="finora-login-container">

        {/* =====================================
            LEFT SIDE - LOGIN FORM
        ===================================== */}

        <section className="login-left">

          {/* BRAND */}

          <div className="login-brand">

            <div className="login-brand-icon">
              F
            </div>

            <div>
              <h2>Finora</h2>

              <p>
                AI Financial Risk & Credit Intelligence
              </p>
            </div>

          </div>


          {/* REGISTER TOP */}

          <div className="login-register-top">
            <span>Don't have an account?</span>

            <Link to="/signup">
              Register
            </Link>
          </div>


          {/* FORM AREA */}

          <div className="login-form-wrapper">

            <div className="login-small-icon">
              <ArrowUpRight size={20} />
            </div>

            <h1>
              Log in to your account
            </h1>

            <p className="login-subtitle">
              Welcome back! Please enter your details.
            </p>


            {/* ERROR */}

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}


            <form onSubmit={handleSubmit}>

              {/* EMAIL */}

              <div className="login-field">

                <label>
                  Email Address
                </label>

                <div className="login-input-box">

                  <Mail size={17} />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    required
                  />

                </div>

              </div>


              {/* PASSWORD */}

              <div className="login-field">

                <label>
                  Password
                </label>

                <div className="login-input-box">

                  <Lock size={17} />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                  />

                  <button
                    type="button"
                    className="login-eye-button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

              </div>


              {/* REMEMBER ME */}

              <div className="login-options">

                <label className="remember-box">

                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) =>
                      setRememberMe(e.target.checked)
                    }
                  />

                  <span>
                    Keep me logged in
                  </span>

                </label>

              </div>


              {/* LOGIN BUTTON */}

              <button
                type="submit"
                className="login-submit-button"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log In"}
              </button>

            </form>


            {/* CREATE ACCOUNT */}

            <div className="login-bottom-register">

              <span>
                Don't have an account?
              </span>

              <Link to="/signup">
                Create Account
              </Link>

            </div>

          </div>


          {/* FOOTER */}

          <div className="login-footer">
            © 2026 Finora
          </div>

        </section>


        {/* =====================================
            RIGHT SIDE
        ===================================== */}

        <section className="login-right">

          <div className="login-right-content">

            <span className="login-ai-badge">
              AI Financial Intelligence
            </span>

            <h1>
              Your smarter way to
              <br />
              understand financial risk.
            </h1>

            <p>
              Risk prediction, expense intelligence,
              EMI analysis and savings planning — all
              in one dashboard.
            </p>


            {/* DASHBOARD IMAGE */}

            <div className="login-dashboard-image">

              <img
                src={loginHero}
                alt="Finora financial dashboard"
                 className="login-hero-image"
                style={{ width: "100%", height: "100%" , objectFit: "contain",
                }}
              />

            </div>

          </div>

        </section>

      </div>

    </div>
  );
}

export default Login;