// src/services/juegosService.js

import axios from 'axios';

const API_URL = 'http://localhost:3000/juegos'; // URL de tu backend, cambia el puerto si es necesario

export const getJuegos = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Usa el token de sesión del usuario
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener los juegos:', error);
    throw error;
  }
};

export const getJuegoById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Usa el token de sesión del usuario
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener el juego:', error);
    throw error;
  }
};
