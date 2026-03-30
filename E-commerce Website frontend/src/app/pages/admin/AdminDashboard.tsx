import React, { useEffect, useState } from 'react';
import { DollarSign, Package, ShoppingBag, Users } from 'lucide-react';
import { productsApi, ordersApi, usersApi } from '../../lib/api'; 
import { Card } from '../../components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
    
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        productsApi.getAll(), 
        ordersApi.getAll(),
        usersApi.getAll()  
      ]);

      const revenue = ordersRes.success 
  ? ordersRes.data.reduce((sum: number, order: any) => 
      sum + Number(order.total || 0), 0)
  : 0;

setStats({
  totalProducts: productsRes.success ? productsRes.data.length : 0,
  totalOrders: ordersRes.success ? ordersRes.data.length : 0,
  totalUsers: usersRes.success ? usersRes.data.length : 0,
  totalRevenue: revenue
});


    } catch (error) {
      console.error("Failed to load dashboard stats", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
  { 
    label: 'Total Revenue', 
    value: `$${Number(stats.totalRevenue || 0).toFixed(2)}`, 
    icon: DollarSign, 
    color: 'text-green-600' 
  },
  { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-blue-600' },
  { label: 'Products', value: stats.totalProducts, icon: Package, color: 'text-purple-600' },
  { label: 'Users', value: stats.totalUsers, icon: Users, color: 'text-orange-600' },
];

  const salesData = [
    { month: 'Jan', sales: 4000, orders: 24 },
    { month: 'Feb', sales: 3000, orders: 18 },
    { month: 'Mar', sales: 5000, orders: 32 },
    { month: 'Apr', sales: 4500, orders: 28 },
    { month: 'May', sales: 6000, orders: 40 },
    { month: 'Jun', sales: 5500, orders: 35 },
  ];

  if (loading) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Sales Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Order Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="orders" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};
