const BASE_URL = 'http://192.168.101.85:8000'; // IP local para pruebas física
// const BASE_URL = 'https://backendcrisolideas.onrender.com';
// For physical device replace with your machine's LAN IP, e.g.: 'http://192.168.x.x:8000'
// For iOS simulator use: 'http://localhost:8000'

export interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  token?: string;
}

export async function apiRequest<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const { method = 'GET', body, token } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage =
      data?.message ?? data?.detail ?? data?.error ?? 'Error desconocido';
    throw new Error(errorMessage);
  }

  return data as T;
}
