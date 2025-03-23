import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";
import StarRating from "../components/StarRating";

const Feedback = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!rating || rating < 1 || rating > 5)
      newErrors.rating = "Please select a rating";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/feedback`, {
        rating,
        comment,
      });
      toast.success("Feedback submitted!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to submit feedback!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        Tell Us What You Think
      </h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-md p-6 space-y-6"
      >
        <div>
          <label className="block font-semibold text-gray-900 mb-2">
            Your Rating
          </label>
          <StarRating
            rating={rating}
            onRatingChange={setRating}
            disabled={loading}
          />
          {errors.rating && (
            <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
          )}
        </div>
        <div>
          <label className="block font-semibold text-gray-900 mb-2">
            Comments
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="How was your experience?"
            rows="4"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors font-semibold flex justify-center items-center"
          disabled={loading}
        >
          {loading ? <LoadingSpinner /> : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
};

export default Feedback;
