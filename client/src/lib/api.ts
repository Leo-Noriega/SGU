const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export type User = {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
};

const jsonHeaders = {
  "Content-Type": "application/json"
};

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || response.statusText);
  }
  return response.json() as Promise<T>;
}

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch(`${API_BASE}/users`, { cache: "no-store" });
  return parseResponse<User[]>(response);
}

export async function createUser(payload: Omit<User, "id">): Promise<User> {
  const response = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(payload)
  });
  return parseResponse<User>(response);
}

export async function updateUser(id: number, payload: Omit<User, "id">): Promise<User> {
  const response = await fetch(`${API_BASE}/users/${id}`, {
    method: "PUT",
    headers: jsonHeaders,
    body: JSON.stringify(payload)
  });
  return parseResponse<User>(response);
}

export async function deleteUser(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/users/${id}`, {
    method: "DELETE"
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || response.statusText);
  }
}
