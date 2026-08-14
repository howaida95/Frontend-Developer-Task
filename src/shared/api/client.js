import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const MAX_RETRIES = 3;
const RETRYABLE_STATUS_CODES = [408, 429, 500, 502, 503, 504];
const RETRYABLE_NETWORK_CODES = ['ERR_NETWORK', 'ECONNABORTED', 'ETIMEDOUT'];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: { Accept: 'application/json' },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    if (!config || axios.isCancel(error)) return Promise.reject(error);

    const status = error.response?.status;
    const maxRetries = config.maxRetries ?? MAX_RETRIES;
    const shouldRetry =
      RETRYABLE_STATUS_CODES.includes(status) ||
      (!error.response && RETRYABLE_NETWORK_CODES.includes(error.code));

    config.__retryCount = config.__retryCount || 0;

    if (shouldRetry && config.__retryCount < maxRetries) {
      const retryCount = config.__retryCount;
      config.__retryCount += 1;
      const exponentialDelay = Math.min(1000 * 2 ** retryCount, 30000);
      const jitter = Math.floor(Math.random() * 250);
      await sleep(exponentialDelay + jitter);
      return api(config);
    }

    if (status === 401 && !config.suppressUnauthorizedHandler) {
      window.dispatchEvent(new Event('riverside:unauthorized'));
    }

    return Promise.reject(error);
  },
);

export class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

const normalizeError = (error) => {
  if (axios.isCancel(error)) {
    const abortError = new Error('Request cancelled.');
    abortError.name = 'AbortError';
    return abortError;
  }

  if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
    return new ApiError(
      'Connection lost. Please check your internet connection.',
      null,
      error.code,
    );
  }

  const response = error.response;
  return new ApiError(
    response?.data?.message || 'Something went wrong.',
    response?.status,
    response?.data?.code,
  );
};

export async function apiRequest(path, options = {}) {
  const {
    signal,
    method = 'GET',
    body,
    params,
    headers = {},
    timeout,
    maxRetries,
    suppressUnauthorizedHandler = false,
  } = options;

  try {
    const response = await api.request({
      url: path,
      method,
      data: body,
      params,
      signal,
      timeout,
      maxRetries,
      suppressUnauthorizedHandler,
      headers: {
        ...headers,
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
    });

    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

export default api;
