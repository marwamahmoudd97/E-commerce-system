import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Package, MapPin } from 'lucide-react';
import { ordersApi } from '../../lib/api';
import { Order } from '../../lib/types';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { PageLoader } from '../../components/LoadingSpinner';

export const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadOrder();
  }, [id]);

  const loadOrder = async () => {
    if (!id) return;
    setLoading(true);
    const response = await ordersApi.getById(id);
    if (response.success && response.data) {
      setOrder(response.data);
    } else {
      navigate('/orders');
    }
    setLoading(false);
  };

  if (loading) return <PageLoader />;
  if (!order) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => navigate('/orders')} className="mb-6">
        ← Back to Orders
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Order #{order.id}</h1>
                <p className="text-sm text-muted-foreground">Placed on {order.createdAt}</p>
              </div>
              <Badge className="capitalize">{order.status}</Badge>
            </div>

            <div className="space-y-4">
              <h2 className="font-semibold">Order Items</h2>
              {order.items.map(item => (
                <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Shipping Address
            </h2>
            <div className="text-sm space-y-1">
              <p>{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
              <p>{order.shippingAddress.country}</p>
              <p>Phone: {order.shippingAddress.phone}</p>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="p-6 space-y-4 sticky top-20">
            <h2 className="font-semibold">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${order.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
            {order.trackingNumber && (
              <div className="pt-4 border-t">
                <p className="text-sm font-semibold mb-1">Tracking Number</p>
                <p className="text-sm text-muted-foreground">{order.trackingNumber}</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
