import React from 'react';
import { useNavigate } from 'react-router';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { Button } from '../../components/ui/button';
import { EmptyState } from '../../components/EmptyState';

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, removeItem, updateQuantity } = useCart();

  const shipping = subtotal > 99 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Add some instruments to your cart to get started"
          action={{ label: 'Shop Now', onClick: () => navigate('/shop') }}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
              <img
                src={item.product.images[0]}
                alt={item.product.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{item.product.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{item.product.brand}</p>
                <p className="font-bold">${item.product.price.toFixed(2)}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="flex items-center border rounded">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </Button>
                  <span className="px-4">{item.quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 space-y-4 sticky top-20">
            <h2 className="text-xl font-bold">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-base">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            {subtotal < 99 && (
              <p className="text-xs text-muted-foreground">
                Add ${(99 - subtotal).toFixed(2)} more for free shipping!
              </p>
            )}
            <Button className="w-full" onClick={() => navigate('/checkout')}>
              Proceed to Checkout
            </Button>
            <Button variant="outline" className="w-full" onClick={() => navigate('/shop')}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
