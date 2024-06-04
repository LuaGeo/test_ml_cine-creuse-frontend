import { useState } from "react";
import Cookies from "js-cookie";

const Login = ({ isVisible, onClose, onUserLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  if (!isVisible) return null;

  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    const requestData = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    };

    const response = await fetch("http://localhost:8000/login", requestData);

    if (response.ok) {
      const data = await response.json();
      alert("Login successful: " + data.message);
      Cookies.set("token", data.token, { secure: true, sameSite: "None" }); // Store token in cookies
      Cookies.set("userId", data.userId, { secure: true, sameSite: "None" }); // Store userId in cookies
      onUserLogin({
        token: data.token,
        username: data.username,
        userId: data.userId,
      });
      onClose(); // Close the modal on successful login
    } else {
      const data = await response.json();
      alert("Login failed: " + data.error);
    }
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h1>Se connecter</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Se connecter</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
