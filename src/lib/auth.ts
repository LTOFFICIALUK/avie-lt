export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('jwt_token');
};

export const setToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('jwt_token', token);
  // Dispatch auth change event
  window.dispatchEvent(new Event('authChange'));
};

export const removeToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('jwt_token');
  // Dispatch auth change event
  window.dispatchEvent(new Event('authChange'));
}; 