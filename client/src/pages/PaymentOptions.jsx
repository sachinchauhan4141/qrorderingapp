import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentOrder } from "../redux/orderSlice";
import { clearCart } from "../redux/cartSlice";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ orderId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  const [loading, setLoading] = useState(false);

  const handleStripePayment = async () => {
    if (!stripe || !elements) return;

    setLoading(true);
    try {
      const totalAmount =
        items.reduce((sum, item) => sum + item.variants[0].price, 0) * 100;
      const {
        data: { clientSecret },
      } = await axios.post(`${import.meta.env.VITE_API_URL}/orders/payment`, {
        amount: totalAmount,
        orderId,
      });

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        const order = {
          _id: orderId,
          status: "Pending",
          paymentMethod: "Stripe",
        };
        await axios.put(
          `${import.meta.env.VITE_API_URL}/orders/${orderId}`,
          order
        );
        dispatch(setCurrentOrder(order));
        dispatch(clearCart());
        toast.success("Payment successful!");
        navigate("/status");
      }
    } catch (error) {
      toast.error("Payment failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <CardElement className="p-4 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500" />
      <button
        onClick={handleStripePayment}
        className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors font-semibold flex justify-center items-center"
        disabled={!stripe || loading}
      >
        {loading ? <LoadingSpinner /> : "Pay with Card"}
      </button>
    </div>
  );
};

const PaymentOptions = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { orderId } = location.state || {};
  const [loadingCash, setLoadingCash] = useState(false);

  const handleCashPayment = async () => {
    setLoadingCash(true);
    try {
      const order = { _id: orderId, status: "Pending", paymentMethod: "Cash" };
      await axios.put(
        `${import.meta.env.VITE_API_URL}/orders/${orderId}`,
        order
      );
      dispatch(setCurrentOrder(order));
      dispatch(clearCart());
      toast.success("Order placed with Cash!");
      navigate("/status");
    } catch (error) {
      toast.error("Failed to process cash payment!");
    } finally {
      setLoadingCash(false);
    }
  };

  if (!orderId) {
    toast.error("No order found!");
    navigate("/");
    return null;
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        Choose Payment Method
      </h2>
      <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
        <Elements stripe={stripePromise}>
          <CheckoutForm orderId={orderId} />
        </Elements>
        <button
          onClick={handleCashPayment}
          className="w-full bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 transition-colors font-semibold flex justify-center items-center"
          disabled={loadingCash}
        >
          {loadingCash ? <LoadingSpinner /> : "Cash on Delivery"}
        </button>
      </div>
    </div>
  );
};

export default PaymentOptions;
