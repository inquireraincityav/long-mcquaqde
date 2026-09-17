import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import BrowseSearch from './pages/BrowseSearch';
import KitBuilder from './pages/KitBuilder';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import PickupReturn from './pages/PickupReturn';
import OrderHistory from './pages/OrderHistory';

export default function App() {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1, paddingTop: 'var(--nav-height)' }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/browse" element={<BrowseSearch />} />
          <Route path="/kit-builder" element={<KitBuilder />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/pickup-return" element={<PickupReturn />} />
          <Route path="/pickup-return/:orderId" element={<PickupReturn />} />
          <Route path="/orders" element={<OrderHistory />} />
        </Routes>
      </main>
    </>
  );
}
