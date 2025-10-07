import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ManagementPage.css'; // Menggunakan styling bersama

const OrderManagementPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const createApiInstance = useCallback(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return null;
        }
        return axios.create({
            baseURL: 'http://localhost:5000/api',
            headers: { 'Authorization': `Bearer ${token}` }
        });
    }, [navigate]);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        const api = createApiInstance();
        if (!api) return;
        try {
            const response = await api.get('/orders/my-orders');
            setOrders(response.data.data || []);
        } catch (err) {
            setError('Gagal memuat daftar pesanan.');
            console.error("Fetch orders error:", err);
        } finally {
            setLoading(false);
        }
    }, [createApiInstance]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleActivate = async (orderId) => {
        if (!window.confirm('Apakah Anda yakin ingin mengonfirmasi pembayaran dan mengaktifkan undangan ini?')) {
            return;
        }
        const api = createApiInstance();
        if (!api) return;
        try {
            await api.put(`/orders/${orderId}/activate`);
            alert('Undangan berhasil diaktifkan!');
            fetchOrders(); // Muat ulang daftar pesanan
        } catch (err) {
            alert(err.response?.data?.error || 'Gagal mengaktifkan undangan.');
        }
    };

    if (loading) {
        return <div className="loading-spinner">Memuat pesanan...</div>;
    }

    return (
        <div className="management-page">
            <header className="page-header">
                <h1>Kelola Pesanan</h1>
            </header>
            <div className="list-card card" style={{ gridColumn: '1 / -1' }}>
                <h2>Daftar Pesanan Masuk</h2>
                {error && <p className="error-message">{error}</p>}
                <table>
                    <thead>
                        <tr>
                            <th>Klien</th>
                            <th>Paket</th>
                            <th>Jumlah</th>
                            <th>Status Pembayaran</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? (
                            orders.map(order => (
                                <tr key={order.id}>
                                    <td>{order.invitation?.client?.username || 'N/A'}</td>
                                    <td>{order.package?.name || 'N/A'}</td>
                                    <td>Rp {Number(order.amount).toLocaleString('id-ID')}</td>
                                    <td>
                                        <span className={`status-badge status-${order.payment_status.toLowerCase().replace(' ', '-')}`}>
                                            {order.payment_status}
                                        </span>
                                    </td>
                                    <td>
                                        {order.payment_status === 'Tertunda' ? (
                                            <button onClick={() => handleActivate(order.id)} className="edit-button">
                                                Aktifkan
                                            </button>
                                        ) : (
                                            'Selesai'
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">Belum ada pesanan yang dibuat.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderManagementPage;
