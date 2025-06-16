import React, { useState } from "react";
import { config } from "../config";

function LoginForm({ onAuthSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const handleLogin = async (isRegister = false) => {
    if (!username || !password) {
      setAuthError("Username and password are required.");
      return;
    }

    const endpoint = isRegister ? "/register" : "/login";

    try {
      const res = await fetch(`${config.AUTH_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && (data.token || isRegister)) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("username", data.username);

        onAuthSuccess({
          token: data.token,
          userId: data.userId,
          username: data.username,
        });
      } else {
        setAuthError(data.error || "Login/Register failed");
      }
    } catch (err) {
      setAuthError("Network error. Please try again.");
    }
  };

  return (
    <div className="auth-box">
      <h2>Login / Register</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button onClick={() => handleLogin(false)}>Login</button>
      <button onClick={() => handleLogin(true)}>Register</button>
      {authError && (
        <div style={{ color: "red", marginTop: "10px" }}>{authError}</div>
      )}
    </div>
  );
}

export default LoginForm;
