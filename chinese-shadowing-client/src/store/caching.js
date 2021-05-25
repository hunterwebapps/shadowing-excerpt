// eslint-disable-next-line
import { EnhancedStore } from '@reduxjs/toolkit';

/** @param {EnhancedStore} store */
export function setState(parent, key, value) {
  const serialized = JSON.stringify(value);
  window.localStorage[key] = serialized;
  parent[key] = value;
}

export function getState(key, initialValue) {
  const serialized = window.localStorage[key];
  if (!serialized) return initialValue;
  return JSON.parse(serialized);
}
