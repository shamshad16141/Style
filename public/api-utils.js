// API utility functions for frontend

const API_URL = 'http://localhost:5000/api';

// User API calls
async function createUser(userData) {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return await response.json();
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}

async function getUser(userId) {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

async function updateUser(userId, userData) {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

// Booking API calls
async function createBooking(bookingData) {
  try {
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
}

async function getBooking(bookingId) {
  try {
    const response = await fetch(`${API_URL}/bookings/${bookingId}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching booking:', error);
    throw error;
  }
}

async function getUserBookings(userId) {
  try {
    const response = await fetch(`${API_URL}/bookings/user/${userId}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
}

async function updateBooking(bookingId, bookingData) {
  try {
    const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  }
}

async function deleteBooking(bookingId) {
  try {
    const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
      method: 'DELETE'
    });
    return await response.json();
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
}

// Local storage helpers
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
