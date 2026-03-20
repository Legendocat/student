const API_BASE = 'http://localhost:3001/api';

function getToken() {
  return localStorage.getItem('token');
}

function getHeaders(isJson = true) {
  const headers = {};
  if (isJson) headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export async function register(payload) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function login(payload) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function logout() {
  const res = await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    headers: getHeaders(),
  });
  return res.json();
}

export async function getProfile() {
  const res = await fetch(`${API_BASE}/users/me`, {
    headers: getHeaders(false),
  });
  return res.json();
}

export async function getItems(search = '') {
  const url = new URL(`${API_BASE}/items`);
  url.searchParams.set('page', '1');
  url.searchParams.set('limit', '10');
  if (search) url.searchParams.set('search', search);
  const res = await fetch(url, { headers: getHeaders(false) });
  return res.json();
}

export async function createItem(payload) {
  const res = await fetch(`${API_BASE}/items`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function deleteItem(id) {
  const res = await fetch(`${API_BASE}/items/${id}`, {
    method: 'DELETE',
    headers: getHeaders(false),
  });
  return res.json();
}

export async function likeItem(id) {
  const res = await fetch(`${API_BASE}/items/${id}/likes`, {
    method: 'POST',
    headers: getHeaders(false),
  });
  return res.json();
}

export async function unlikeItem(id) {
  const res = await fetch(`${API_BASE}/items/${id}/likes`, {
    method: 'DELETE',
    headers: getHeaders(false),
  });
  return res.json();
}

export async function addComment(id, content) {
  const res = await fetch(`${API_BASE}/items/${id}/comments`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ content }),
  });
  return res.json();
}
