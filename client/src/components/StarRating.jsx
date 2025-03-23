import { IoStar, IoStarOutline } from "react-icons/io5";

const StarRating = ({ rating, onRatingChange, disabled }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !disabled && onRatingChange(star)}
          className={`text-2xl ${
            rating >= star ? "text-yellow-400" : "text-gray-300"
          } ${
            disabled
              ? "cursor-not-allowed"
              : "hover:text-yellow-500 transition-colors"
          }`}
          disabled={disabled}
        >
          {rating >= star ? <IoStar /> : <IoStarOutline />}
        </button>
      ))}
    </div>
  );
};

export default StarRating;
