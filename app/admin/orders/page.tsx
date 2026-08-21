'use client';

import React, { useState, useEffect } from 'react';
import { Search, CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

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

  const handleApproveReject = async (orderId: string, action: 'approve' | 'reject') => {
    if (action === 'reject' && !confirm('Are you sure you want to reject this payment?')) return;

    setProcessingId(orderId);
    try {
      const res = await fetch('/api/admin/orders/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, action }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        fetchOrders();

        if (action === 'approve' && data.whatsappUrl) {
          window.open(data.whatsappUrl, '_blank');
        }

        alert(data.message);
      } else {
        alert(data.error || 'Failed to process');
      }
    } catch {
      alert('Network error');
    } finally {
      setProcessingId(null);
    }
  };

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
          <p className="text-xs text-slate-500 dark:text-slate-400">Approve UPI payments, manage refunds, and audit all transactions.</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none font-bold"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING_REVIEW">⏳ Pending Review</option>
            <option value="PAID">✅ PAID</option>
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

      {/* Pending Review Alert Banner */}
      {orders.filter(o => o.status === 'PENDING_REVIEW').length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 flex items-center gap-3">
          <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <p className="text-xs font-bold text-amber-800 dark:text-amber-300">
            ⏳ {orders.filter(o => o.status === 'PENDING_REVIEW').length} payment(s) waiting for your approval!
          </p>
        </div>
      )}

      <div className="rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-white/10">
              <tr>
                <th className="p-4">Order #</th>
                <th className="p-4">Student</th>
                <th className="p-4">Course</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Method / UTR</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {orders.map((ord) => (
                <tr
                  key={ord.id}
                  className={`hover:bg-slate-50 dark:hover:bg-white/5 transition-colors ${
                    ord.status === 'PENDING_REVIEW' ? 'bg-amber-50/50 dark:bg-amber-500/5' : ''
                  }`}
                >
                  <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">{ord.orderNumber}</td>

                  <td className="p-4">
                    <p className="font-bold text-slate-900 dark:text-white">{ord.user?.name}</p>
                    <p className="text-[11px] text-slate-400">{ord.user?.email}</p>
                    {ord.user?.phone && <p className="text-[10px] text-[#C49339] dark:text-[#F0C96A] font-semibold">{ord.user.phone}</p>}
                  </td>

                  <td className="p-4 font-medium text-slate-800 dark:text-slate-200">
                    {ord.course?.title || (ord.itemType === 'SESSION' ? '1:1 Session' : 'Course')}
                  </td>

                  <td className="p-4 font-black text-slate-900 dark:text-[#F0C96A]">
                    ₹{ord.amount.toLocaleString('en-IN')}
                  </td>

                  <td className="p-4">
                    <span className="font-bold text-slate-900 dark:text-white block text-[11px]">{ord.paymentMethod || 'ONLINE'}</span>
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
                          : ord.status === 'PENDING_REVIEW'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 animate-pulse'
                          : ord.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                          : ord.status === 'REFUNDED'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
                      }`}
                    >
                      {ord.status === 'PENDING_REVIEW' ? '⏳ REVIEW' : ord.status}
                    </span>
                  </td>

                  <td className="p-4 text-slate-500 dark:text-slate-400">{new Date(ord.createdAt).toLocaleDateString()}</td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {ord.status === 'PENDING_REVIEW' && (
                        <>
                          <button
                            onClick={() => handleApproveReject(ord.id, 'approve')}
                            disabled={processingId === ord.id}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-extrabold flex items-center gap-1 disabled:opacity-50"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleApproveReject(ord.id, 'reject')}
                            disabled={processingId === ord.id}
                            className="px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-extrabold flex items-center gap-1 disabled:opacity-50"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        </>
                      )}

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
                    </div>
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
