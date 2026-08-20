'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw, CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    const params = new URLSearchParams();
    if (statusFilter !== 'ALL') params.append('status', statusFilter);
    if (search) params.append('search', search);

    fetch(`/api/admin/orders?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) setOrders(data.orders);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, search]);

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
      });

      if (res.ok) fetchOrders();
    } catch {
      alert('Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Orders & Transactions</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Audit course purchases, mentorship payments, and refund records.</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none font-bold"
          >
            <option value="ALL">All Statuses</option>
            <option value="PAID">PAID</option>
            <option value="PENDING">PENDING</option>
            <option value="FAILED">FAILED</option>
            <option value="REFUNDED">REFUNDED</option>
          </select>

          <div className="relative w-48 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Order # or student..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#D6A84F] focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-white/10">
              <tr>
                <th className="p-4">Order Number</th>
                <th className="p-4">Student</th>
                <th className="p-4">Item Type</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Method</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">{ord.orderNumber}</td>

                  <td className="p-4">
                    <p className="font-bold text-slate-900 dark:text-white">{ord.user?.name}</p>
                    <p className="text-[11px] text-slate-400">{ord.user?.email}</p>
                    {ord.user?.phone && <p className="text-[10px] text-[#C49339] dark:text-[#F0C96A] font-semibold">{ord.user.phone}</p>}
                  </td>

                  <td className="p-4 font-medium text-slate-800 dark:text-slate-200">
                    {ord.course?.title || (ord.itemType === 'SESSION' ? '1:1 Mentorship Session' : 'Course')}
                  </td>

                  <td className="p-4 font-black text-slate-900 dark:text-[#F0C96A]">
                    ₹{ord.amount.toLocaleString('en-IN')}
                  </td>

                  <td className="p-4">
                    <span className="font-bold text-slate-900 dark:text-white block text-[11px]">{ord.paymentMethod || 'PHONEPE_UPI_QR'}</span>
                    {ord.razorpayPaymentId && (
                      <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 block truncate max-w-[140px]" title={ord.razorpayPaymentId}>
                        {ord.razorpayPaymentId}
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        ord.status === 'PAID'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                          : ord.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                          : ord.status === 'REFUNDED'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>

                  <td className="p-4 text-slate-500 dark:text-slate-400">{new Date(ord.createdAt).toLocaleDateString()}</td>

                  <td className="p-4 text-right space-x-2">
                    {ord.status === 'PAID' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'REFUNDED')}
                        className="px-2.5 py-1 rounded bg-purple-50 dark:bg-purple-500/10 hover:bg-purple-100 dark:hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-[11px] font-bold"
                      >
                        Refund
                      </button>
                    )}
                    {ord.status === 'PENDING' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'PAID')}
                        className="px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold"
                      >
                        Mark Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
