import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { CheckCircle, Package } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';

export const OrderSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 mb-6">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
        <p className="text-muted-foreground mb-8">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>

        {order && (
          <Card className="p-6 mb-8 text-left">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5" />
              <h2 className="font-semibold">Order Details</h2>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Number</span>
                <span className="font-semibold">#{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Amount</span>
                <span className="font-semibold">${order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="capitalize">{order.status}</span>
              </div>
            </div>
          </Card>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate('/orders')}>
            View Orders
          </Button>
          <Button variant="outline" onClick={() => navigate('/shop')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};
