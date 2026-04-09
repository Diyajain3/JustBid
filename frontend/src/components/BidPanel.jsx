export default function BidPanel() {
  return (
    <div className="bg-white p-4 rounded-xl shadow sticky top-20">
      <h3 className="font-semibold mb-2">Place Bid</h3>

      <input
        type="number"
        placeholder="Enter amount"
        className="w-full border p-2 rounded mb-3"
      />

      <div className="flex gap-2 mb-3">
        <button className="px-3 py-1 bg-gray-200 rounded">+10</button>
        <button className="px-3 py-1 bg-gray-200 rounded">+50</button>
        <button className="px-3 py-1 bg-gray-200 rounded">+100</button>
      </div>

      <button className="w-full bg-indigo-600 text-white py-2 rounded">
        Submit Bid
      </button>
    </div>
  );
}