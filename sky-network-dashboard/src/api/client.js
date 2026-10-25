import axios from 'axios';
import { io } from 'socket.io-client';

// Backend API URL
const baseURL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL,
  timeout: 10000,
});

// --- REST endpoints ---

export async function getLiveFlights() {
  const { data } = await api.get('/api/flights/live');

  return {
    flights: data.data,
    source: data.source,
    freshness: data.freshness,
    snapshotTimestamp: data.snapshotTimestamp,
    sourceTimestamp: data.sourceTimestamp,
    sourceError: data.error || data.sourceError || null,
    sourceErrorCode: data.errorCode || data.sourceErrorCode || null,
  };
}

export async function getFlightByCode(flightCode) {
  const { data } = await api.get(`/api/flights/${flightCode}`);
  return data.data;
}

export async function getAircraftMetadata(icao24) {
  const { data } = await api.get(`/api/flights/aircraft/${encodeURIComponent(icao24)}`);
  return data;
}

export async function searchFlights(filters = {}, options = {}) {
  const { data } = await api.get('/api/flights/search', {
    ...options,
    params: filters,
  });

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

let socket;

export function connectSocket() {
  if (!socket) {
    socket = io(baseURL, {
      autoConnect: true,
    });
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

  return () => {
    connectSocket().off('flight-update', callback);
  };
}