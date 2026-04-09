import BidPanel from "../components/BidPanel";

export default function AuctionDetails() {
  return (
    <div className="p-6 grid md:grid-cols-2 gap-6">
      <img
        src="https://via.placeholder.com/400"
        className="rounded-xl"
      />

      <div>
        <h2 className="text-2xl font-bold mb-2">
          Auction Item
        </h2>

        <p className="text-indigo-600 text-xl font-bold mb-4">
          $500
        </p>

        <BidPanel />
      </div>
    </div>
  );
}