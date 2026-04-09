import { Link } from "react-router-dom";

export default function AuctionCard({ item }) {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition">
      <img
        src={item.image}
        alt={item.title}
        className="h-48 w-full object-cover rounded-t-xl"
      />

      <div className="p-4">
        <h3 className="font-semibold text-lg">{item.title}</h3>

        <p className="text-indigo-600 font-bold text-xl">
          ${item.bid}
        </p>

        <p className="text-orange-500">⏳ {item.time}</p>

        <Link
          to={`/auction/${item.id}`}
          className="block mt-3 text-center bg-indigo-600 text-white py-2 rounded"
        >
          Place Bid
        </Link>
      </div>
    </div>
  );
}
