
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:3000";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function handleSignup(e) {
    e.preventDefault();
    setError("");

    if (!form.username.trim() || !form.email.trim() || !form.password) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${API}/api/auth/signup`,
        form
      );

      // If backend returns a token, log in automatically
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);

        if (res.data.user) {
          localStorage.setItem(
            "user",
            JSON.stringify(res.data.user)
          );
        }

        navigate("/", { replace: true });
      } else {
        navigate("/login");
      }

    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">

      <form
        onSubmit={handleSignup}
        className="bg-gray-800 p-8 rounded-2xl w-full max-w-md text-white"
      >
        <h1 className="text-3xl font-bold text-center mb-2">
          Create Account
        </h1>

        <p className="text-gray-400 text-center mb-8">
          Join our music community
        </p>

        {error && (
          <p className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4">
            {error}
          </p>
        )}

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded-lg bg-gray-700 outline-none"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded-lg bg-gray-700 outline-none"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 mb-6 rounded-lg bg-gray-700 outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-400 text-black font-bold p-3 rounded-full disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-400 font-bold"
          >
            Login
          </Link>
        </p>

      </form>
    </div>
  );
}

export default Signup;
