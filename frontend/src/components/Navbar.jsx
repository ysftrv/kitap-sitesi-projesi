import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Sol: Site başlığı */}
        <Link to="/" className="text-xl font-bold text-blue-600 hover:text-blue-700">
          Kitap Sitesi
        </Link>

        {/* Orta: Navigasyon linkleri */}
        <div className="flex gap-6">
          <Link to="/books" className="text-gray-600 hover:text-blue-600 font-medium">
            Kitaplar
          </Link>
        </div>

        {/* Sağ: Giriş durumuna göre değişen alan */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-gray-700 font-medium">Merhaba, {user.username}</span>
              <Link
                to="/add-book"
                className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 text-sm"
              >
                Kitap Ekle
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-500 text-sm"
              >
                Çıkış
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium">
                Giriş
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 text-sm"
              >
                Kayıt Ol
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}
