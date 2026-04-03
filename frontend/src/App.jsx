import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar          from "./components/Navbar";
import ProtectedRoute  from "./components/ProtectedRoute";

import Home       from "./pages/Home";
import Books      from "./pages/Books";
import BookDetail from "./pages/BookDetail";
import Login      from "./pages/Login";
import Register   from "./pages/Register";
import AddBook    from "./pages/AddBook";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 text-gray-800">
          <Navbar />
          <main>
            <Routes>
              <Route path="/"           element={<Home />} />
              <Route path="/books"      element={<Books />} />
              <Route path="/books/:id"  element={<BookDetail />} />
              <Route path="/login"      element={<Login />} />
              <Route path="/register"   element={<Register />} />
              <Route
                path="/add-book"
                element={
                  <ProtectedRoute>
                    <AddBook />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
