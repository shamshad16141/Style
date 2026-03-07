// @ts-nocheck
(() => {
  const API_BASE_URL = '/api';

  async function parseResponse(response) {
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  }

  async function createUser(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      return await parseResponse(response);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async function loginUser(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      return await parseResponse(response);
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  async function getUser(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`);
      return await parseResponse(response);
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  async function updateUser(userId, userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      return await parseResponse(response);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async function createBooking(bookingData) {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      return await parseResponse(response);
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  async function getBooking(bookingId) {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`);
      return await parseResponse(response);
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  }

  async function getUserBookings(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/user/${userId}`);
      return await parseResponse(response);
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  }

  async function updateBooking(bookingId, bookingData) {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      return await parseResponse(response);
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  }

  async function deleteBooking(bookingId) {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
        method: 'DELETE'
      });

      return await parseResponse(response);
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  }

  function saveUserToSession(user) {
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  function getUserFromSession() {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  function clearUserSession() {
    sessionStorage.removeItem('user');
  }

  Object.assign(window, {
    createUser,
    loginUser,
    getUser,
    updateUser,
    createBooking,
    getBooking,
    getUserBookings,
    updateBooking,
    deleteBooking,
    saveUserToSession,
    getUserFromSession,
    clearUserSession
  });
})();
