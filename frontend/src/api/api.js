import apiClient from './client';

/**
 * Fetch all foods grouped by meal type
 * Returns: { breakfast: [], lunch: [], dinner: [] }
 */
export const fetchFoods = async () => {
  const response = await apiClient.get('/foods');
  return response.data;
};

/**
 * Fetch daily food log for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 */
export const fetchDailyLog = async (date) => {
  const response = await apiClient.get(`/daily-log/${date}`);
  return response.data;
};

/**
 * Save daily food log
 * @param {object} data - { date, breakfast, lunch, dinner }
 */
export const saveDailyLog = async (data) => {
  const response = await apiClient.post('/daily-log', data);
  return response.data;
};

/**
 * Fetch daily logs for a date range
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 */
export const fetchDailyLogsRange = async (startDate, endDate) => {
  const response = await apiClient.get(`/daily-log/range?start=${startDate}&end=${endDate}`);
  return response.data;
};

/**
 * Fetch all weight entries
 */
export const fetchWeightLogs = async () => {
  const response = await apiClient.get('/weight');
  return response.data;
};

/**
 * Save weight entry
 * @param {object} data - { date, weight }
 */
export const saveWeightLog = async (data) => {
  const response = await apiClient.post('/weight', data);
  return response.data;
};
