const API_BASE_URL = 'http://localhost:3002/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${error.message}`);
      throw error;
    }
  }

  // Auth methods
  async register(email, password, displayName) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, displayName }),
    });
    
    if (data.token) {
      this.setToken(data.token);
    }
    
    return data;
  }

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.token) {
      this.setToken(data.token);
    }
    
    return data;
  }

  async getCurrentUser() {
    return await this.request('/auth/me');
  }

  async logout() {
    this.clearToken();
  }

  // Profile methods
  async getProfile() {
    return await this.request('/profile');
  }

  async updateProfile(profileData) {
    return await this.request('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Settings methods
  async getUserSettings() {
    return await this.request('/settings');
  }

  async updateUserSettings(settings) {
    return await this.request('/settings', {
      method: 'PUT',
      body: JSON.stringify({ settings }),
    });
  }

  // Book methods
  async getBooks(searchTerm, selectedSubjects) {
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (selectedSubjects && selectedSubjects.length > 0) {
      params.append('subjects', JSON.stringify(selectedSubjects));
    }
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return await this.request(`/books${queryString}`);
  }

  async getBookTraditions() {
    return await this.request('/books/traditions');
  }

  async getBookById(id) {
    return await this.request(`/books/${id}`);
  }

  async createBook(bookData, file = null) {
    // If file is provided, use FormData for multipart upload
    if (file) {
      const formData = new FormData();
      formData.append('bookFile', file);
      formData.append('bookData', JSON.stringify(bookData));
      
      const url = `${API_BASE_URL}/books`;
      
      const config = {
        method: 'POST',
        body: formData,
        headers: {
          ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        },
      };

      try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error(`API request failed: ${error.message}`);
        throw error;
      }
    } else {
      // Regular JSON request for text-based books
      return await this.request('/books', {
        method: 'POST',
        body: JSON.stringify(bookData),
      });
    }
  }

  // Sadhana methods
  async getUserSadhanas() {
    return await this.request('/sadhanas');
  }

  async createSadhana(sadhanaData) {
    return await this.request('/sadhanas', {
      method: 'POST',
      body: JSON.stringify(sadhanaData),
    });
  }

  async updateSadhana(id, sadhanaData) {
    return await this.request(`/sadhanas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sadhanaData),
    });
  }

  async deleteSadhana(id) {
    return await this.request(`/sadhanas/${id}`, {
      method: 'DELETE',
    });
  }

  async getSadhanaProgress(sadhanaId) {
    return await this.request(`/sadhanas/${sadhanaId}/progress`);
  }

  async upsertSadhanaProgress(sadhanaId, progressData) {
    return await this.request(`/sadhanas/${sadhanaId}/progress`, {
      method: 'POST',
      body: JSON.stringify(progressData),
    });
  }
}

export default new ApiService();