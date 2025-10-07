// File: client/src/themes/index.js
// Berfungsi sebagai "peta" atau registri untuk semua komponen tema.
// Ia mengimpor setiap komponen tema dan mengekspornya dalam satu objek.

import ElegantTheme from './Elegant/ElegantTheme';
import RusticTheme from './Rustic/RusticTheme';
// Import tema-tema lain di sini di masa depan, contoh:
// import MinimalistTheme from './Minimalist/MinimalistTheme';

export const themes = {
  // Setiap kunci di sini harus cocok persis dengan 'component_name' di database Anda
  ElegantTheme,
  RusticTheme,
  // MinimalistTheme,
};

