import { useState, useCallback } from 'react';

const STORAGE_KEY = 'lm-rental-orders';

function loadOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveOrders(orders) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch {
    // storage full or unavailable
  }
}

export default function useOrders() {
  const [orders, setOrders] = useState(loadOrders);

  const addOrder = useCallback((order) => {
    const newOrder = {
      id: `Q-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
      createdAt: new Date().toISOString(),
      status: 'upcoming',
      ...order,
    };
    setOrders((prev) => {
      const updated = [newOrder, ...prev];
      saveOrders(updated);
      return updated;
    });
    return newOrder;
  }, []);

  const updateOrderStatus = useCallback((orderId, status) => {
    setOrders((prev) => {
      const updated = prev.map((o) =>
        o.id === orderId ? { ...o, status } : o
      );
      saveOrders(updated);
      return updated;
    });
  }, []);

  return { orders, addOrder, updateOrderStatus };
}
