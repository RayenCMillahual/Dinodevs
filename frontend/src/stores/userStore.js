import { defineStore } from 'pinia';
import Cookies from 'js-cookie';
import { login, register } from '@/services/authService';


export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: null,
    loading: false,
    error: null,
  }),
  actions: {
    async loginUser(credentials) {
      this.loading = true;
      this.error = null;
      try {
        const data = await login(credentials.email, credentials.password);
                       // Guardar el usuario y el token en el estado y cookies

        this.user = data.user;  // Almacenar el usuario completo
        this.token = data.token;
        Cookies.set('token', data.token, { expires: 1 });
        return { success: true };
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al iniciar sesión';
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },
  // Método de registro
async registerUser(credentials) {
  this.loading = true;
  this.error = null;
  try {
    console.log('Datos de registro:', credentials);

    // Verifica que los datos sean correctos antes de enviarlos
    if (!credentials.name || !credentials.email || !credentials.password) {
      throw new Error('Todos los campos son requeridos');
    }

    const data = await register(credentials.name, credentials.email, credentials.password);

    // Verifica si los datos devueltos son correctos
    console.log('Datos de registro recibidos:', data);

    this.user = data.user;
    this.token = data.token;
    Cookies.set('token', data.token, { expires: 1 });

    return { success: true };
  } catch (error) {
    this.error = error.response?.data?.message || error.message || 'Error al registrar usuario';
    console.error('Error al registrar usuario:', this.error);  // Verifica el error completo
    return { success: false, message: this.error };
  } finally {
    this.loading = false;
  }
},

/*     cierre de sesion
 */    logout() {
      this.user = null;
      this.token = null;
      Cookies.remove('token');
    }


  },
  getters: {
    isAuthenticated: (state) => {
      const token = Cookies.get('token');
      if (token) {
        state.token = token;
        return true;
      }
      return false;
    },
  }
});


/* Login: Realiza una solicitud de inicio de sesión, guarda los datos del usuario y token en el estado y las cookies.
Registro: Realiza una solicitud de registro, valida los datos del usuario, y guarda la información del usuario y token si la operación es exitosa.
Logout: Limpia los datos del usuario y el token del estado y elimina las cookies.
Autenticación: Verifica si hay un token válido en las cookies para determinar si el usuario está autenticado.
 */
