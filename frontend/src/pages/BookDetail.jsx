import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function BookDetail() {
  const { id }           = useParams();
  const { user }         = useAuth();

  const [book,    setBook]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  // Yorum formu state'leri
  const [rating,  setRating]  = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviewError,   setReviewError]   = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  function fetchBook() {
    setLoading(true);
    api.get(`/books/${id}`)
      .then((res) => setBook(res.data.book))
      .catch(() => setError("Kitap yüklenirken bir hata oluştu."))
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchBook(); }, [id]);

  async function handleReviewSubmit(e) {
    e.preventDefault();
    setReviewError("");
    setReviewSuccess("");
    setSubmitting(true);

    try {
      await api.post(`/books/${id}/reviews`, { rating, comment });
      setReviewSuccess("Yorumunuz eklendi!");
      setComment("");
      setRating(5);
      fetchBook(); // yorumları yenile
    } catch (err) {
      setReviewError(err.response?.data?.error || "Yorum eklenemedi.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="text-center py-20 text-gray-500">Yükleniyor...</div>;
  if (error)   return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!book)   return null;

  const avgRating = book.avg_rating;
  const stars     = avgRating
    ? "★".repeat(Math.round(avgRating)) + "☆".repeat(5 - Math.round(avgRating))
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Kitap bilgileri */}
      <div className="flex flex-col md:flex-row gap-8 mb-10">

        {/* Kapak */}
        <div className="md:w-48 flex-shrink-0">
          {book.cover_image_url ? (
            <img
              src={book.cover_image_url}
              alt={book.title}
              className="w-full rounded-lg shadow"
            />
          ) : (
            <div className="w-full h-64 bg-blue-50 rounded-lg flex items-center justify-center text-blue-300 text-6xl shadow">
              📖
            </div>
          )}
        </div>

        {/* Detaylar */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">{book.title}</h1>
          <p className="text-lg text-gray-500 mb-4">{book.author}</p>

          {/* Kategoriler */}
          <div className="flex flex-wrap gap-2 mb-4">
            {book.categories.map((cat) => (
              <span key={cat.id} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                {cat.name}
              </span>
            ))}
          </div>

          {/* Puan */}
          {stars && (
            <div className="text-yellow-400 text-xl mb-4">
              {stars}{" "}
              <span className="text-gray-500 text-base">
                {avgRating} ({book.review_count} yorum)
              </span>
            </div>
          )}

          {/* Açıklama */}
          {book.description && (
            <p className="text-gray-700 mb-4 leading-relaxed">{book.description}</p>
          )}

          {/* Bilgi listesi */}
          <ul className="text-sm text-gray-500 space-y-1">
            {book.page_count     && <li><span className="font-medium text-gray-700">Sayfa:</span> {book.page_count}</li>}
            {book.published_year && <li><span className="font-medium text-gray-700">Yıl:</span> {book.published_year}</li>}
            {book.isbn           && <li><span className="font-medium text-gray-700">ISBN:</span> {book.isbn}</li>}
          </ul>
        </div>
      </div>

      {/* Yorumlar bölümü */}
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Yorumlar ({book.reviews?.length || 0})
      </h2>

      {book.reviews && book.reviews.length > 0 ? (
        <div className="space-y-4 mb-8">
          {book.reviews.map((review) => (
            <div key={review.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-800">{review.username}</span>
                <span className="text-yellow-400">
                  {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                </span>
              </div>
              {review.comment && (
                <p className="text-gray-600 text-sm">{review.comment}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {new Date(review.created_at).toLocaleDateString("tr-TR")}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 mb-8">Henüz yorum yok. İlk yorumu sen yap!</p>
      )}

      {/* Yorum ekleme formu — yalnızca giriş yapılmışsa */}
      {user ? (
        <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Yorum Yap</h3>

          {reviewError   && <div className="text-red-500 text-sm mb-3">{reviewError}</div>}
          {reviewSuccess && <div className="text-green-600 text-sm mb-3">{reviewSuccess}</div>}

          <form onSubmit={handleReviewSubmit}>
            {/* Puan seçimi */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Puan</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    type="button"
                    key={val}
                    onClick={() => setRating(val)}
                    className={`text-2xl ${rating >= val ? "text-yellow-400" : "text-gray-300"}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Yorum metni */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Yorumunuz</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Kitap hakkında düşüncelerinizi yazın..."
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Gönderiliyor..." : "Gönder"}
            </button>
          </form>
        </div>
      ) : (
        <p className="text-gray-500 text-sm">
          Yorum yapmak için{" "}
          <a href="/login" className="text-blue-600 hover:underline">giriş yapın</a>.
        </p>
      )}
    </div>
  );
}
