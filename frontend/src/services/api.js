import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_URL}/users/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('accessToken', access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

export const authAPI = {
  register: (data) => api.post('/users/register/', data),
  login: (data) => api.post('/users/login/', data),
  getProfile: () => api.get('/users/profile/'),
  updateProfile: (data) => api.put('/users/profile/', data),
  changePassword: (data) => api.post('/users/change-password/', data),
};

export const eventsAPI = {
  getEvents: (params) => api.get('/events/', { params }),
  getEvent: (slug) => api.get(`/events/${slug}/`),
  getCategories: () => api.get('/events/categories/'),
  getFeaturedEvents: () => api.get('/events/featured/'),
  getEventStats: () => api.get('/events/stats/'),
  createEvent: (data) => api.post('/events/create/', data),
  updateEvent: (slug, data) => api.put(`/events/${slug}/update/`, data),
  deleteEvent: (slug) => api.delete(`/events/${slug}/delete/`),
  getMyEvents: () => api.get('/events/my/events/'),
};

export const ordersAPI = {
  getOrders: () => api.get('/orders/'),
  createOrder: (data) => api.post('/orders/create/', data),
  getOrder: (orderNumber) => api.get(`/orders/${orderNumber}/`),
  getMyTickets: () => api.get('/orders/tickets/'),
  getTicket: (ticketNumber) => api.get(`/orders/tickets/${ticketNumber}/`),
  initiatePayment: (orderNumber, data) => api.post(`/orders/${orderNumber}/pay/`, data),
};