import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function AddBook() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");

  // Form alanları
  const [form, setForm] = useState({
    title:           "",
    author:          "",
    description:     "",
    isbn:            "",
    cover_image_url: "",
    page_count:      "",
    published_year:  "",
  });
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Kategorileri yükle
  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data.categories));
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleCategoryToggle(id) {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        ...form,
        page_count:     form.page_count     ? parseInt(form.page_count)     : null,
        published_year: form.published_year ? parseInt(form.published_year) : null,
        category_ids:   selectedCategories,
      };

      await api.post("/books", payload);
      navigate("/books");
    } catch (err) {
      setError(err.response?.data?.error || "Kitap eklenemedi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Kitap Ekle</h1>

      {error && (
        <div className="bg-red-50 text-red-600 border border-red-200 rounded px-3 py-2 text-sm mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Başlık */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kitap Adı *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Yazar */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Yazar *</label>
          <input
            name="author"
            value={form.author}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Açıklama */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* ISBN */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
          <input
            name="isbn"
            value={form.isbn}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Kapak URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kapak Görseli URL</label>
          <input
            name="cover_image_url"
            value={form.cover_image_url}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Sayfa sayısı ve yıl — yan yana */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Sayfa Sayısı</label>
            <input
              name="page_count"
              type="number"
              min="1"
              value={form.page_count}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Yayın Yılı</label>
            <input
              name="published_year"
              type="number"
              min="1000"
              max="2100"
              value={form.published_year}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>

        {/* Kategori seçimi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Kategoriler</label>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.id)}
                  onChange={() => handleCategoryToggle(cat.id)}
                  className="accent-blue-600"
                />
                <span className="text-sm text-gray-700">{cat.name}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 font-medium"
        >
          {loading ? "Ekleniyor..." : "Kitabı Ekle"}
        </button>
      </form>
    </div>
  );
}
