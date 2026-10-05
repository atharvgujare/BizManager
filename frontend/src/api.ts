export const API_BASE_URL = 'http://localhost:5058/api';

let token: string | null = localStorage.getItem('biz_token') || null;

export const setToken = (newToken: string | null) => {
  token = newToken;
  if (newToken) {
    localStorage.setItem('biz_token', newToken);
  } else {
    localStorage.removeItem('biz_token');
  }
};

export const getToken = () => token;

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Request error ${res.status}`);
  }

  if (res.status === 204) return {} as T;
  return await res.json();
}

export const api = {
  getProducts: () => apiFetch<any[]>('/products'),
  getCustomers: () => apiFetch<any[]>('/customers'),
  getInvoices: () => apiFetch<any[]>('/invoices'),
  getSummary: () => apiFetch<any>('/dashboard/summary'),
  createProduct: (data: any) => apiFetch<any>('/products', { method: 'POST', body: JSON.stringify(data) }),
  createCustomer: (data: any) => apiFetch<any>('/customers', { method: 'POST', body: JSON.stringify(data) }),
  createInvoice: (data: any) => apiFetch<any>('/invoices', { method: 'POST', body: JSON.stringify(data) }),
};
