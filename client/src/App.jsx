import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Menu from "./pages/Menu";
import Kitchen from "./pages/Kitchen";
import AdminMenu from "./pages/AdminMenu";
import OrderDetails from "./pages/OrderDetails";
import OrderForm from "./pages/OrderForm";
import PaymentOptions from "./pages/PaymentOptions";
import OrderStatus from "./pages/OrderStatus";
import Feedback from "./pages/Feedback";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <main className="flex-grow pb-16">
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/order-details" element={<OrderDetails />} />
          <Route path="/order-form" element={<OrderForm />} />
          <Route path="/payment" element={<PaymentOptions />} />
          <Route path="/status" element={<OrderStatus />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/kitchen" element={<Kitchen />} />
          <Route path="/admin" element={<AdminMenu />} />
        </Routes>
      </main>
      <Navbar />
    </div>
  );
}

export default App;
