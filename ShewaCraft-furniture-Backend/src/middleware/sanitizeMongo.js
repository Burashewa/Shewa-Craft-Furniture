const FORBIDDEN = new Set(['__proto__', 'constructor', 'prototype']);

function stripDollarKeys(value, seen = new WeakSet()) {
  if (!value || typeof value !== 'object') return value;
  if (seen.has(value)) return value;
  seen.add(value);

  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i += 1) {
      value[i] = stripDollarKeys(value[i], seen);
    }
    return value;
  }

  for (const key of Object.keys(value)) {
    if (key.startsWith('$') || FORBIDDEN.has(key)) {
      delete value[key];
      continue;
    }
    value[key] = stripDollarKeys(value[key], seen);
  }
  return value;
}

export function sanitizeMongo(req, _res, next) {
  if (req.body && typeof req.body === 'object') {
    stripDollarKeys(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    stripDollarKeys(req.query);
  }
  if (req.params && typeof req.params === 'object') {
    stripDollarKeys(req.params);
  }
  next();
}
