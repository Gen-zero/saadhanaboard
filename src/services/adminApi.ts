export const ADMIN_API_BASE = 'http://localhost:3002/api/admin';

async function adminRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${ADMIN_API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
    ...init,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data && (data.message || data.error)) || `HTTP ${res.status}`);
  }
  return res.json();
}

export const adminApi = {
  async login(username: string, password: string) {
    return adminRequest<{ message: string }>('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },
  async me() {
    return adminRequest<{ user: { id: number; role: string; username: string } }>('/me');
  },
  async logout() {
    return adminRequest<{ message: string }>('/logout', { method: 'POST' });
  },
  async stats() {
    return adminRequest<{
      totalUsers: number;
      activeUsers: number;
      activeSadhanas: number;
      completedSadhanas: number;
      uploadedBooks: number;
      currentThemes: number;
      recentLogins: number;
      todaysSadhanas: number;
      weeklyLogins: Array<{ date: string; logins: number }>;
      weeklySadhanaCompletions: Array<{ date: string; completions: number }>;
    }>('/stats');
  },
  async listUsers(q = '', limit = 20, offset = 0) {
    const params = new URLSearchParams({ q, limit: String(limit), offset: String(offset) });
    return adminRequest<{ users: Array<{ id: number; email: string; display_name: string; is_admin: boolean; active: boolean }> }>(`/users?${params.toString()}`);
  },
  async updateUser(id: number, payload: Partial<{ email: string; display_name: string; is_admin: boolean; active: boolean }>) {
    return adminRequest<{ message: string }>(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
  },
  async logs(limit = 50, offset = 0, action = '', admin_id = '') {
    const params = new URLSearchParams({ 
      limit: String(limit), 
      offset: String(offset),
      ...(action && { action }),
      ...(admin_id && { admin_id })
    });
    return adminRequest<{ logs: any[] }>(`/logs?${params.toString()}`);
  },
  // Enhanced user management
  async getUserDetails(id: number) {
    return adminRequest<{ user: any; sadhanas: any[] }>(`/users/${id}`);
  },
  async deleteUser(id: number) {
    return adminRequest<{ message: string }>(`/users/${id}`, { method: 'DELETE' });
  },
  // Assets
  async listAssets() {
    return adminRequest<{ assets: any[] }>(`/assets`);
  },
  async uploadAsset(file: File, meta: { title?: string; type?: string }) {
    const form = new FormData();
    form.append('file', file);
    if (meta.title) form.append('title', meta.title);
    if (meta.type) form.append('type', meta.type);
    const res = await fetch(`${ADMIN_API_BASE}/assets`, { method: 'POST', body: form, credentials: 'include' });
    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  },
  async updateAsset(id: number, payload: any) {
    return adminRequest<{ asset: any }>(`/assets/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
  },
  async deleteAsset(id: number) {
    return adminRequest<{ message: string }>(`/assets/${id}`, { method: 'DELETE' });
  },
  // Enhanced asset management
  async getAssetStats() {
    return adminRequest<any>(`/assets/stats`);
  },
  // Themes
  async listThemes() { return adminRequest<{ themes: any[] }>(`/themes`); },
  async createTheme(payload: any) { return adminRequest<{ theme: any }>(`/themes`, { method: 'POST', body: JSON.stringify(payload) }); },
  async updateTheme(id: number, payload: any) { return adminRequest<{ theme: any }>(`/themes/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }); },
  async deleteTheme(id: number) { return adminRequest<{ message: string }>(`/themes/${id}`, { method: 'DELETE' }); },
  async previewTheme(id: number) {
    return adminRequest<{ theme: any; preview: any }>(`/themes/${id}/preview`);
  },
  // Templates
  async listTemplates() { return adminRequest<{ templates: any[] }>(`/templates`); },
  async createTemplate(payload: any) { return adminRequest<{ template: any }>(`/templates`, { method: 'POST', body: JSON.stringify(payload) }); },
  async updateTemplate(id: number, payload: any) { return adminRequest<{ template: any }>(`/templates/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }); },
  async deleteTemplate(id: number) { return adminRequest<{ message: string }>(`/templates/${id}`, { method: 'DELETE' }); },
  async getTemplate(id: number) {
    return adminRequest<{ template: any }>(`/templates/${id}`);
  },
  // Enhanced settings & reports
  async getSettings() { 
    return adminRequest<{ settings: any }>(`/settings`); 
  },
  async saveSettings(payload: any) { 
    return adminRequest<{ message: string; settings: any }>(`/settings`, { method: 'PUT', body: JSON.stringify(payload) }); 
  },
  // Reports
  reportUsersCsvUrl(startDate?: string, endDate?: string) { 
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return `${ADMIN_API_BASE}/reports/users.csv?${params.toString()}`; 
  },
  reportSadhanasCsvUrl() {
    return `${ADMIN_API_BASE}/reports/sadhanas.csv`;
  },
  async getStatsReport() {
    return adminRequest<any>(`/reports/stats`);
  },
};


