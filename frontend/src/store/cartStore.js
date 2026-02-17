import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  items: [],
  event: null,

  addItem: (ticketType, quantity) => {
    const { items } = get();
    const existingItem = items.find((item) => item.ticket_type.id === ticketType.id);

    if (existingItem) {
      set({
        items: items.map((item) =>
          item.ticket_type.id === ticketType.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ),
      });
    } else {
      set({
        items: [...items, { ticket_type: ticketType, quantity }],
      });
    }
  },

  updateQuantity: (ticketTypeId, quantity) => {
    const { items } = get();
    
    if (quantity === 0) {
      set({
        items: items.filter((item) => item.ticket_type.id !== ticketTypeId),
      });
    } else {
      set({
        items: items.map((item) =>
          item.ticket_type.id === ticketTypeId
            ? { ...item, quantity }
            : item
        ),
      });
    }
  },

  removeItem: (ticketTypeId) => {
    set({
      items: get().items.filter((item) => item.ticket_type.id !== ticketTypeId),
    });
  },

  setEvent: (event) => {
    set({ event });
  },

  clearCart: () => {
    set({ items: [], event: null });
  },

  getTotal: () => {
    const { items } = get();
    return items.reduce(
      (total, item) => total + item.ticket_type.price * item.quantity,
      0
    );
  },

  getTotalTickets: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.quantity, 0);
  },
}));

export default useCartStore;