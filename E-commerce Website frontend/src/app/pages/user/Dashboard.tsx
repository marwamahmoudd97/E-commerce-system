import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Package, Heart, User, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { ordersApi } from '../../lib/api';
import { Order } from '../../lib/types';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { wishlist } = useWishlist();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadOrders();
  }, [isAuthenticated]);

  const loadOrders = async () => {
    if (!user) return;
    const response = await ordersApi.getByUser(user.id);
    if (response.success) {
      setOrders(response.data);
    }
  };

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, link: '/orders' },
    { label: 'Wishlist Items', value: wishlist.length, icon: Heart, link: '/wishlist' },
    { label: 'Profile', value: 'View', icon: User, link: '/profile' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground">Manage your account and orders</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(stat.link)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <Icon className="h-8 w-8 text-primary" />
              </div>
            </Card>
          );
        })}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Recent Orders</h2>
          <Button variant="outline" onClick={() => navigate('/orders')}>
            View All
          </Button>
        </div>

        {orders.length === 0 ? (
          <Card className="p-8 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No orders yet</p>
            <Button onClick={() => navigate('/shop')}>Start Shopping</Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.slice(0, 3).map(order => (
              <Card
                key={order.id}
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/order/${order.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Order #{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.createdAt}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${order.total.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground capitalize">{order.status}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
