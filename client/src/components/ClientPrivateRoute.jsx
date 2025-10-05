import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

/**
 * Komponen PrivateRoute khusus untuk dasbor Klien.
 * Memeriksa otentikasi klien di sessionStorage sebelum memberikan akses.
 */
const ClientPrivateRoute = ({ children }) => {
    const { slug } = useParams();

    // Memeriksa apakah data otentikasi klien ada di sessionStorage untuk slug yang sesuai.
    const isAuthenticated = !!sessionStorage.getItem(`client_auth_${slug}`);

    // Jika terotentikasi, tampilkan komponen anak (yaitu, ClientDashboardPage).
    // Jika tidak, arahkan kembali ke halaman login klien untuk slug tersebut.
    return isAuthenticated ? children : <Navigate to={`/u/${slug}`} />;
};

// INI BAGIAN YANG HILANG DAN PENYEBAB ERROR:
export default ClientPrivateRoute;

