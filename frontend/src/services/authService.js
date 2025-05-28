/* Este archivo manejará las peticiones relacionadas con autenticación (login y registro).
 */

import api from './api';

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Error en login:', error.response?.data || error.message);
    throw error;
  }
};

export const register = async (name, email, password) => {  // Agregamos 'name'
  try {
    const response = await api.post('/auth/register', { name, email, password });  // Incluimos 'name'
    return response.data;
  } catch (error) {
    console.error('Error en register:', error.response?.data || error.message);
    throw error;
  }
};
