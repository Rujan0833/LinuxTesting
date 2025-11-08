import { Link } from 'react-router-dom';

function WatchCard({ watch }) {
  return (
    <Link to={`/watch/${watch.id}`}>
      <div className="bg-[#1a1a1a] rounded-lg overflow-hidden hover:ring-2 hover:ring-dark-red-light transition cursor-pointer">
        <img 
          src={watch.image_url} 
          alt={watch.name}
          className="w-full h-64 object-cover"
        />
        <div className="p-4">
          <p className="text-sm text-dark-red-light font-semibold mb-1">
            {watch.brand}
          </p>
          <h3 className="text-xl font-bold text-white mb-2">
            {watch.name}
          </h3>
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {watch.description}
          </p>
          <div className="flex justify-between items-center">
            <p className="text-2xl font-bold text-dark-red-light">
              ${watch.price.toLocaleString()}
            </p>
            <p className="text-sm text-gray-400">
              Stock: {watch.stock}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default WatchCard;
