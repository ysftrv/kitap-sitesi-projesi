import { createContext, useContext, useState, useEffect } from "react";
import api from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true); // başlangıçta token kontrolü yapılıyor

  // Sayfa yenilenince token varsa kullanıcıyı çek
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.get("/auth/me")
        .then((res) => setUser(res.data.user))
        .catch(() => {
          // Token geçersizse temizle
          localStorage.removeItem("token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Giriş yap: token ve kullanıcıyı sakla
  function login(token, userData) {
    localStorage.setItem("token", token);
    setUser(userData);
  }

  // Çıkış yap: token ve kullanıcıyı temizle
  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Kullanım kolaylığı için hook
export function useAuth() {
  return useContext(AuthContext);
}
