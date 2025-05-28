// creacion del store de cart

import { defineStore } from 'pinia';
import type { ThemeState } from '../models/ThemeState'

export const useThemeStore  = defineStore({
  id: "theme",
  state: (): ThemeState => ({

    isDark: false,
    mode: "Light Mode"

  }),
  actions: {
    cambioDeTema() {
      this.isDark = !this.isDark;
      this.mode = this.isDark ? 'Dark Mode' : 'Light Mode';
    },
  },
});

