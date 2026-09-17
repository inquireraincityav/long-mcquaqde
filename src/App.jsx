import { Routes, Route, Navigate } from 'react-router-dom';
import BottomTabBar from './components/BottomTabBar';
import BrowseSearch from './pages/BrowseSearch';
import KitBuilder from './pages/KitBuilder';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import PickupReturn from './pages/PickupReturn';
import OrderHistory from './pages/OrderHistory';

export default function App() {
  return (
    <>
      <main style={styles.main}>
        <Routes>
          <Route path="/" element={<Navigate to="/browse" replace />} />
          <Route path="/browse" element={<BrowseSearch />} />
          <Route path="/kit-builder" element={<KitBuilder />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/pickup-return" element={<PickupReturn />} />
          <Route path="/pickup-return/:orderId" element={<PickupReturn />} />
          <Route path="/orders" element={<OrderHistory />} />
        </Routes>
      </main>
      <BottomTabBar />
    </>
  );
}

const styles = {
  main: {
    flex: 1,
    paddingBottom: 'var(--bottom-nav-height)',
    maxWidth: 'var(--max-width)',
    margin: '0 auto',
    width: '100%',
  },
};
