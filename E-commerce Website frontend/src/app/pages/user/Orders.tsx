import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Package } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ordersApi } from '../../lib/api';
import { Order } from '../../lib/types';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { EmptyState } from '../../components/EmptyState';
import { PageLoader } from '../../components/LoadingSpinner';

export const Orders: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadOrders();
  }, [isAuthenticated]);

  const loadOrders = async () => {
    if (!user) return;
    setLoading(true);
    const response = await ordersApi.getByUser(user.id);
    if (response.success) {
      setOrders(response.data);
    }
    setLoading(false);
  };

  if (loading) return <PageLoader />;

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="Start shopping to see your orders here"
          action={{ label: 'Shop Now', onClick: () => navigate('/shop') }}
        />
      </div>
    );
  }

  const statusColors = {
    pending: 'bg-yellow-500',
    processing: 'bg-blue-500',
    shipped: 'bg-purple-500',
    delivered: 'bg-green-500',
    cancelled: 'bg-red-500'
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      
      <div className="space-y-4">
        {orders.map(order => (
          <Card
            key={order.id}
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/order/${order.id}`)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-semibold text-lg">Order #{order.id}</p>
                <p className="text-sm text-muted-foreground">Placed on {order.createdAt}</p>
              </div>
              <Badge className={statusColors[order.status]}>
                {order.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                </p>
              </div>
              <p className="text-lg font-semibold">${order.total.toFixed(2)}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
