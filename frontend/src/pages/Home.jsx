import AuctionCard from "../components/AuctionCard";

const data = [
  {
    id: 1,
    title: "MacBook Pro",
    bid: 1200,
    time: "02:15:10",
    image: "https://via.placeholder.com/300",
  },
  {
    id: 2,
    title: "iPhone 15",
    bid: 800,
    time: "01:05:44",
    image: "https://via.placeholder.com/300",
  },
];

export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-6">
        Bid Smart. Win Fast.
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {data.map((item) => (
          <AuctionCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}