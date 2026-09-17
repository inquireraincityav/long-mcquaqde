import { createContext, useContext, useReducer, useCallback } from 'react';

const CartContext = createContext(null);

const initialState = {
  items: [],
  dateRange: { start: null, end: null },
  location: null,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(
        (i) => i.product === action.payload.product
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.product === action.payload.product
              ? { ...i, qty: i.qty + (action.payload.qty || 1) }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [
          ...state.items,
          {
            ...action.payload,
            qty: action.payload.qty || 1,
            dateRange: action.payload.dateRange || state.dateRange,
          },
        ],
      };
    }

    case 'ADD_KIT': {
      const kitItems = action.payload.items.map((item) => ({
        ...item,
        dateRange: action.payload.dateRange || state.dateRange,
      }));
      const merged = [...state.items];
      for (const kitItem of kitItems) {
        const idx = merged.findIndex((i) => i.product === kitItem.product);
        if (idx >= 0) {
          merged[idx] = { ...merged[idx], qty: merged[idx].qty + kitItem.qty };
        } else {
          merged.push(kitItem);
        }
      }
      return {
        ...state,
        items: merged,
        dateRange: action.payload.dateRange || state.dateRange,
      };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((i) => i.product !== action.payload),
      };

    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map((i) =>
          i.product === action.payload.product
            ? { ...i, qty: Math.max(1, action.payload.qty) }
            : i
        ),
      };

    case 'UPDATE_ITEM_DATES':
      return {
        ...state,
        items: state.items.map((i) =>
          i.product === action.payload.product
            ? { ...i, dateRange: action.payload.dateRange }
            : i
        ),
      };

    case 'SET_DATE_RANGE':
      return {
        ...state,
        dateRange: action.payload,
        items: state.items.map((i) => ({
          ...i,
          dateRange: action.payload,
        })),
      };

    case 'SET_LOCATION':
      return { ...state, location: action.payload };

    case 'CLEAR_CART':
      return initialState;

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = useCallback(
    (item) => dispatch({ type: 'ADD_ITEM', payload: item }),
    []
  );

  const addKit = useCallback(
    (kit) => dispatch({ type: 'ADD_KIT', payload: kit }),
    []
  );

  const removeItem = useCallback(
    (product) => dispatch({ type: 'REMOVE_ITEM', payload: product }),
    []
  );

  const updateQty = useCallback(
    (product, qty) =>
      dispatch({ type: 'UPDATE_QTY', payload: { product, qty } }),
    []
  );

  const updateItemDates = useCallback(
    (product, dateRange) =>
      dispatch({
        type: 'UPDATE_ITEM_DATES',
        payload: { product, dateRange },
      }),
    []
  );

  const setDateRange = useCallback(
    (dateRange) => dispatch({ type: 'SET_DATE_RANGE', payload: dateRange }),
    []
  );

  const setLocation = useCallback(
    (location) => dispatch({ type: 'SET_LOCATION', payload: location }),
    []
  );

  const clearCart = useCallback(
    () => dispatch({ type: 'CLEAR_CART' }),
    []
  );

  const itemCount = state.items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        ...state,
        itemCount,
        addItem,
        addKit,
        removeItem,
        updateQty,
        updateItemDates,
        setDateRange,
        setLocation,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
