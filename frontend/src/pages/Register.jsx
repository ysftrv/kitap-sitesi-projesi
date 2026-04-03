import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", { username, email, password });
      // Kayıt başarılıysa login sayfasına yönlendir
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Kayıt başarısız.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white border border-gray-200 rounded-lg p-8 w-full max-w-sm shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Kayıt Ol</h1>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 rounded px-3 py-2 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kullanıcı Adı</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {loading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-5">
          Zaten hesabın var mı?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Giriş yap
          </Link>
        </p>
      </div>
    </div>
  );
}
