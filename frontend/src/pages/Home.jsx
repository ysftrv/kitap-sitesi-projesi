import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import BookCard from "../components/BookCard";

export default function Home() {
  const [books,      setBooks]      = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Son eklenen 4 kitap ve kategorileri paralel çek
    Promise.all([
      api.get("/books?per_page=4"),
      api.get("/categories"),
    ])
      .then(([booksRes, catsRes]) => {
        setBooks(booksRes.data.books);
        setCategories(catsRes.data.categories);
      })
      .catch(() => setError("Veriler yüklenirken bir hata oluştu."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-500">Yükleniyor...</div>;
  if (error)   return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Karşılama bölümü */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">Kitap Dünyası</h1>
        <p className="text-gray-500 text-lg">
          Yeni kitaplar keşfet, yorumlar oku, kendi değerlendirmeni ekle.
        </p>
        <Link
          to="/books"
          className="inline-block mt-5 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Tüm Kitaplara Göz At
        </Link>
      </div>

      {/* Son eklenen kitaplar */}
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Son Eklenen Kitaplar</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-12">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {/* Kategoriler */}
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Kategoriler</h2>
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => navigate(`/books?category=${cat.id}`)}
            className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full hover:bg-blue-100 font-medium"
          >
            {cat.name}
          </button>
        ))}
      </div>

    </div>
  );
}
