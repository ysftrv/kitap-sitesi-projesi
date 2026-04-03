import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api";
import BookCard from "../components/BookCard";

export default function Books() {
  const [books,      setBooks]      = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  // URL parametrelerinden durumu oku
  const searchQuery  = searchParams.get("q")        || "";
  const categoryId   = searchParams.get("category") || "";
  const currentPage  = parseInt(searchParams.get("page") || "1");

  // Arama kutusu için ayrı yerel state (her tuşta istek atmamak için)
  const [inputValue, setInputValue] = useState(searchQuery);

  // Kitapları getir
  useEffect(() => {
    setLoading(true);
    setError("");

    let request;
    if (searchQuery) {
      request = api.get(`/books/search?q=${searchQuery}`);
    } else {
      const params = new URLSearchParams({ page: currentPage, per_page: 9 });
      if (categoryId) params.set("category", categoryId);
      request = api.get(`/books?${params}`);
    }

    request
      .then((res) => {
        setBooks(res.data.books || []);
        setTotalPages(res.data.pages || 1);
      })
      .catch(() => setError("Kitaplar yüklenirken bir hata oluştu."))
      .finally(() => setLoading(false));
  }, [searchQuery, categoryId, currentPage]);

  // Kategorileri tek seferlik yükle
  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data.categories));
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    const params = {};
    if (inputValue.trim()) params.q = inputValue.trim();
    setSearchParams(params);
  }

  function handleCategoryChange(id) {
    const params = {};
    if (id) params.category = id;
    setSearchParams(params);
    setInputValue("");
  }

  function handlePageChange(newPage) {
    const params = {};
    if (categoryId) params.category = categoryId;
    params.page = newPage;
    setSearchParams(params);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Kitaplar</h1>

      {/* Arama kutusu */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-5">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Kitap adı veya yazar ara..."
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          Ara
        </button>
        {(searchQuery || categoryId) && (
          <button
            type="button"
            onClick={() => { setSearchParams({}); setInputValue(""); }}
            className="border border-gray-300 px-4 py-2 rounded text-gray-600 hover:bg-gray-50"
          >
            Temizle
          </button>
        )}
      </form>

      {/* Kategori filtreleme butonları */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => handleCategoryChange("")}
          className={`px-3 py-1.5 rounded-full text-sm font-medium ${
            !categoryId ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Tümü
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${
              categoryId === String(cat.id)
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* İçerik */}
      {loading && <div className="text-center py-20 text-gray-500">Yükleniyor...</div>}
      {error   && <div className="text-center py-10 text-red-500">{error}</div>}

      {!loading && !error && books.length === 0 && (
        <div className="text-center py-20 text-gray-400">Sonuç bulunamadı.</div>
      )}

      {!loading && !error && books.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          {/* Sayfalama — yalnızca arama yokken göster */}
          {!searchQuery && totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Önceki
              </button>
              <span className="text-gray-600">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Sonraki →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
