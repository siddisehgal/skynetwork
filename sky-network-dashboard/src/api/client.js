import axios from 'axios';
import { io } from 'socket.io-client';

// Set VITE_API_URL in a .env file at the project root, e.g.:
//   VITE_API_URL=http://localhost:5000
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL,
  timeout: 10000,
});

// --- REST endpoints (mirrors skycommand-backend/routes/*.js) ---

export async function getLiveFlights() {
  const { data } = await api.get('/api/flights/live');
  return data.data;
}

export async function getFlightByCode(flightCode) {
  const { data } = await api.get(`/api/flights/${flightCode}`);
  return data.data;
}

export async function searchFlights(filters = {}, options = {}) {
  const { data } = await api.get('/api/flights/search', { ...options, params: filters });
  return data;
}

export async function getAnalyticsStats() {
  const { data } = await api.get('/api/analytics/stats');
  return data.data;
}

export async function getSector(sectorId) {
  const { data } = await api.get(`/api/sectors/${sectorId}`);
  return data.data;
}

export async function getAirports(options = {}) {
  const { data } = await api.get('/api/airports', options);
  return data.data;
}

// --- WebSocket connection ---
// NOTE: as of this writing, sockets/flightUpdates.js on the backend only
// handles join/leave room membership — it never emits a 'flight-update'
// event. Until that's added server-side, onFlightUpdate's callback will
// simply never fire. Polling (see useLiveFlights hook) is the reliable
// path for now; treat the socket as progressive enhancement.
let socket;

export function connectSocket() {
  if (!socket) {
    socket = io(baseURL, { autoConnect: true });
  }
  return socket;
}

export function joinFlightRoom(flightCode) {
  connectSocket().emit('join-flight', flightCode);
}

export function leaveFlightRoom(flightCode) {
  connectSocket().emit('leave-flight', flightCode);
}

export function onFlightUpdate(callback) {
  connectSocket().on('flight-update', callback);
  return () => connectSocket().off('flight-update', callback);
}
