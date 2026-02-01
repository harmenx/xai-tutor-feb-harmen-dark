"use client";

import React, { useState, useEffect } from 'react';
import { RefreshCcw, Download, Plus } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { StatsCards } from '../components/orders/StatsCards';
import { OrdersTable } from '../components/orders/OrdersTable';
import { CreateOrderModal } from '../components/orders/CreateOrderModal';
import { Button } from '../components/ui/Button';
import { Order } from '../lib/types';

// Assuming running locally; normally use env var
const API_URL = 'http://localhost:8000';

export default function Home() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({ total_orders_this_month: 0, pending_orders: 0, shipped_orders: 0, refunded_orders: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);

  // Sorting state
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchData = async () => {
    setLoading(true);
    try {
      // Build query string based on active filter, pagination, and sorting
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        sort_by: sortBy,
        sort_order: sortOrder
      });

      if (activeTab !== 'All') {
        // Mapping UI tabs to backend statuses
        if (activeTab === 'Incomplete') params.append('status', 'Pending');
        else if (activeTab === 'Finished') params.append('status', 'Completed');
        // 'Overdue' and 'Ongoing' don't map directly in this simple schema
      }

      const [ordersRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/orders?${params.toString()}`),
        fetch(`${API_URL}/orders/stats`)
      ]);

      if (ordersRes.ok) {
        const data = await ordersRes.json();
        setOrders(data.orders);
        setTotalItems(data.total);
      }

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, currentPage, sortBy, sortOrder]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(orders.map(o => o.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const handleDeleteOne = async (id: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    try {
      await fetch(`${API_URL}/orders/${id}`, { method: 'DELETE' });
      setOrders(prev => prev.filter(o => o.id !== id));
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      const statsRes = await fetch(`${API_URL}/orders/stats`);
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (err) {
      alert('Failed to delete order');
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.size} orders?`)) return;
    try {
      const ids = Array.from(selectedIds);
      await fetch(`${API_URL}/orders/bulk`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_ids: ids }),
      });
      await fetchData();
      setSelectedIds(new Set());
    } catch (err) {
      alert('Failed to delete orders');
    }
  };

  const handleBulkDuplicate = async () => {
    try {
      const ids = Array.from(selectedIds);
      await fetch(`${API_URL}/orders/bulk/duplicate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_ids: ids }),
      });
      await fetchData();
      setSelectedIds(new Set());
    } catch (err) {
      alert('Failed to duplicate orders');
    }
  };

  const handleBulkStatusUpdate = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Mark ${selectedIds.size} orders as Completed?`)) return;

    try {
      const ids = Array.from(selectedIds);
      await fetch(`${API_URL}/orders/bulk/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_ids: ids, status: 'Completed' }),
      });
      await fetchData();
      setSelectedIds(new Set());
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(orders));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "orders.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleCreateOrder = async (data: any) => {
    await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    await fetchData();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedIds(new Set()); // Clear selections when changing pages
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to page 1 when changing filters
    setSelectedIds(new Set());
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      // Toggle sort order if clicking the same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to descending
      setSortBy(field);
      setSortOrder('desc');
    }
    setCurrentPage(1); // Reset to page 1 when sorting changes
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <Layout>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">All Orders</h2>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="gap-2 bg-white text-slate-700 hover:bg-slate-50 border-slate-200 dark:bg-slate-950"
            onClick={handleBulkStatusUpdate}
            disabled={selectedIds.size === 0}
          >
            <RefreshCcw size={16} />
            <span>Bulk Update Status</span>
          </Button>
          <Button
            variant="outline"
            className="gap-2 bg-white text-slate-700 hover:bg-slate-50 border-slate-200 dark:bg-slate-950"
            onClick={handleExport}
          >
            <Download size={16} />
            <span>Export Orders</span>
          </Button>
          <Button
            variant="primary"
            className="gap-2 bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus size={18} />
            <span>Add Orders</span>
          </Button>
        </div>
      </div>

      <div className="mb-8">
        <StatsCards stats={stats} />
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading data...</div>
      ) : (
        <OrdersTable
          orders={orders}
          selectedIds={selectedIds}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onSelectAll={handleSelectAll}
          onSelectOne={handleSelectOne}
          onDeleteOne={handleDeleteOne}
          onBulkDelete={handleBulkDelete}
          onBulkDuplicate={handleBulkDuplicate}
          onClearSelection={() => setSelectedIds(new Set())}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
        />
      )}

      <CreateOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateOrder}
      />
    </Layout>
  );
}
