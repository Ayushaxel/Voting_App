import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const APIURL = "http://localhost:3000";
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const response = await fetch(`${APIURL}/user/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          // console.log(data);
          setUser(data);
        } catch (error) {
          logout();
        }
      }
    };
    fetchUser();
  }, [token]);

  const login = async (aadharCardNumber, password) => {
    try {
      const res = await fetch(`${APIURL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ aadharCardNumber, password }),
      });

      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      // Save token and user data
      localStorage.setItem("token", data.token);
      setToken(data.token);

      return data;
    } catch (error) {
      console.error("Login Error:", error.message);
      throw error;
    }
  };

  const signup = async (formData) => {
    // console.log(formData);
    const res = await fetch(`${APIURL}/user/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(res);
    localStorage.setItem("token", data.token);
    setToken(data.token);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout , APIURL}}>
      {children}
    </AuthContext.Provider>
  );
};
