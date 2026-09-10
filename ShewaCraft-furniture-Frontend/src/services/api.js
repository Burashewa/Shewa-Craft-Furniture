import { clearAllSessions, getAccessToken } from './session';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(
  /\/$/,
  ''
);

export class ApiError extends Error {
  constructor(message, { status, fields } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fields = fields;
  }
}

export async function api(path, { method = 'GET', body, auth = false } = {}) {
  const headers = {};
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  if (body !== undefined && !isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  if (auth) {
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body:
        body === undefined
          ? undefined
          : isFormData
            ? body
            : JSON.stringify(body),
    });
  } catch {
    throw new ApiError('Unable to reach the server. Check your connection and try again.');
  }

  let data = null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    if (response.status === 401 && auth) {
      clearAllSessions();
    }
    throw new ApiError(data?.error?.message || 'Request failed', {
      status: response.status,
      fields: data?.error?.fields,
    });
  }

  return data;
}
