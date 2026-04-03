import { Link } from "react-router-dom";

export default function BookCard({ book }) {
  // Açıklamayı 80 karakterde kes
  const shortDesc = book.description
    ? book.description.slice(0, 80) + (book.description.length > 80 ? "..." : "")
    : "Açıklama yok.";

  // Yıldız gösterimi
  const stars = book.avg_rating
    ? "★".repeat(Math.round(book.avg_rating)) + "☆".repeat(5 - Math.round(book.avg_rating))
    : null;

  return (
    <Link
      to={`/books/${book.id}`}
      className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      {/* Kapak görseli veya placeholder */}
      {book.cover_image_url ? (
        <img
          src={book.cover_image_url}
          alt={book.title}
          className="w-full h-40 object-cover rounded mb-3"
        />
      ) : (
        <div className="w-full h-40 bg-blue-50 rounded mb-3 flex items-center justify-center text-blue-300 text-4xl">
          📖
        </div>
      )}

      <h3 className="font-semibold text-gray-800 text-base leading-snug">{book.title}</h3>
      <p className="text-sm text-gray-500 mb-2">{book.author}</p>
      <p className="text-sm text-gray-600">{shortDesc}</p>

      {/* Puan */}
      {stars && (
        <div className="mt-2 text-yellow-400 text-sm">
          {stars}{" "}
          <span className="text-gray-500">({book.avg_rating})</span>
        </div>
      )}
    </Link>
  );
}
