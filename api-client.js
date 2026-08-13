class SkycommandAPI {
  constructor() {
    this.baseUrl = window.SKYCOMMAND_API_BASE_URL || 'http://localhost:5000/api';
    this.wsUrl = window.SKYCOMMAND_WS_URL || 'http://localhost:5000';
    this.socket = null;
    this.flightUpdateCallbacks = [];
    this.statsUpdateCallbacks = [];

    this.initializeSocket();
  }

  initializeSocket() {
    if (typeof window.io !== 'function') {
      return;
    }

    try {
      this.socket = window.io(this.wsUrl, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5
      });

      this.socket.on('flight:update', (flight) => {
        this.flightUpdateCallbacks.forEach((callback) => callback(flight));
      });

      this.socket.on('dashboard:stats', (stats) => {
        this.statsUpdateCallbacks.forEach((callback) => callback(stats));
      });
    } catch (error) {
      console.warn('Socket connection unavailable:', error);
    }
  }

  onFlightUpdate(callback) {
    this.flightUpdateCallbacks.push(callback);
  }

  onStatsUpdate(callback) {
    this.statsUpdateCallbacks.push(callback);
  }

  async request(path) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      headers: {
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json();
  }

  async getLiveFlights() {
    const payload = await this.request('/flights/live');
    return payload.data || [];
  }

  async getFlightDetails(flightCode) {
    const payload = await this.request(`/flights/${encodeURIComponent(flightCode)}`);
    return payload.data || null;
  }

  async searchFlights(params = {}) {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.set(key, value);
      }
    });

    const suffix = query.toString() ? `?${query.toString()}` : '';
    const payload = await this.request(`/flights/search${suffix}`);
    return payload.data || [];
  }

  async getStats() {
    const payload = await this.request('/analytics/stats');
    return payload.data || {};
  }

  joinFlightRoom(flightCode) {
    if (this.socket) {
      this.socket.emit('join-flight', flightCode);
    }
  }

  leaveFlightRoom(flightCode) {
    if (this.socket) {
      this.socket.emit('leave-flight', flightCode);
    }
  }
}

window.skycommandApi = new SkycommandAPI();