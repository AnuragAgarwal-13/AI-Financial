import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, TrendingUp } from "lucide-react";


import API from "../services/api";
import signupImage from "../assets/signup_finance.png";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      await API.post("/auth/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      alert("Account created successfully!");

      navigate("/login");
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
    <div className="signup-page">

      <div className="signup-container">

        {/* ==========================
            LEFT PANEL
        ========================== */}

        <section className="signup-visual">

          <div className="signup-brand">

            <div className="signup-logo">
              F
            </div>

            <div>
              <h2>Finora</h2>

              <span>
                AI Financial Intelligence
              </span>
            </div>

          </div>

          <div className="visual-heading">

            <div className="visual-icon">
              <TrendingUp size={22} />
            </div>

            <h1>
              Finance made
              <br />
              smarter with Finora.
            </h1>

            <p>
              Understand risk, manage expenses and
              build a stronger financial future.
            </p>

          </div>

          {/* MAIN ILLUSTRATION */}

          <div className="finance-illustration">

            <img
              src={signupImage}
              alt="Finora financial illustration"
            />

          </div>

          <div className="visual-footer">

            <div>
              <strong>AI Powered</strong>
              <span>Risk Intelligence</span>
            </div>

            <div>
              <strong>Smart</strong>
              <span>Expense Tracking</span>
            </div>

            <div>
              <strong>Better</strong>
              <span>Savings Planning</span>
            </div>

          </div>

        </section>


        {/* ==========================
            RIGHT PANEL
        ========================== */}

        <section className="signup-form-section">

          {/* TOP LOGIN */}

          <div className="existing-account">

            <span>Already a member?</span>

            <Link to="/login">
              Sign in now
            </Link>

          </div>


          <div className="signup-form-container">

            <div className="form-heading">

              <span className="small-heading">
                GET STARTED
              </span>

              <h1>
                Sign up for an account
              </h1>

              <p>
                Create your Finora account and start
                managing your finances intelligently.
              </p>

            </div>


            {/* ERROR */}

            {error && (
              <div className="signup-error">
                {error}
              </div>
            )}


            <form onSubmit={handleSubmit}>

              {/* NAME */}

              <div className="signup-field">

                <label>
                  Full name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* EMAIL */}

              <div className="signup-field">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* PASSWORD */}

              <div className="signup-field">

                <label>
                  Password
                </label>

                <div className="password-field">

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>

                </div>

              </div>


              {/* CONFIRM PASSWORD */}

              <div className="signup-field">

                <label>
                  Confirm password
                </label>

                <div className="password-field">

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>

                </div>

              </div>


              {/* SIGNUP BUTTON */}

              <button
                className="signup-submit"
                type="submit"
                disabled={loading}
              >

                <span>
                  {loading
                    ? "Creating account..."
                    : "Sign up"}
                </span>

                {!loading && (
                  <ArrowRight size={20} />
                )}

              </button>

            </form>


            <div className="mobile-login">

              Already have an account?{" "}

              <Link to="/login">
                Log in
              </Link>

            </div>

          </div>

        </section>

      </div>
    </div>
  );
}