export default function Dashboard() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        Dashboard
      </h2>

      <div className="grid gap-4">
        <div className="bg-white p-4 rounded shadow">
          Active Bids
        </div>

        <div className="bg-white p-4 rounded shadow">
          Watchlist
        </div>

        <div className="bg-white p-4 rounded shadow">
          Won Items
        </div>
      </div>
    </div>
  );
}