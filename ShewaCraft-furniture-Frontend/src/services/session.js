const SESSION_KEY = 'shewacraft_session';

function parseSession(raw) {
  if (!raw) return null;
  try {
    const session = JSON.parse(raw);
    if (!session?.token) return null;
    return session;
  } catch {
    return null;
  }
}

export function getAccessToken() {
  const fromSession = parseSession(sessionStorage.getItem(SESSION_KEY));
  if (fromSession?.token) return fromSession.token;
  const fromLocal = parseSession(localStorage.getItem(SESSION_KEY));
  return fromLocal?.token || null;
}

export function writeSession(token, remember) {
  clearAllSessions();
  const payload = JSON.stringify({ token });
  if (remember) {
    localStorage.setItem(SESSION_KEY, payload);
  } else {
    sessionStorage.setItem(SESSION_KEY, payload);
  }
}

export function clearAllSessions() {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_KEY);
}
