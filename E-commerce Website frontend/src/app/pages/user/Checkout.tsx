import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { CreditCard } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { ordersApi } from '../../lib/api';
import { Address } from '../../lib/types';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { toast } from 'sonner';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { items, subtotal, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit-card');

  const [address, setAddress] = useState<Address>({
    fullName: user?.name || '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    phone: ''
  });

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
    if (items.length === 0) navigate('/cart');
  }, [isAuthenticated, items, navigate]);

  const shipping = subtotal > 99 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !address.fullName ||
      !address.street ||
      !address.city ||
      !address.state ||
      !address.zipCode ||
      !address.phone
    ) {
      toast.error("Please fill all address fields");
      return;
    }

    setLoading(true);

    try {
      const response = await ordersApi.create({
        items,
        subtotal,
        shipping,
        tax,
        total,
        shippingAddress: address,
        paymentMethod,
      });

      if (!response.success) {
        throw new Error("Order failed");
      }

      toast.success("Order placed successfully 🎉");

      clearCart();

      navigate('/order-success', {
        state: { order: response.data }
      });

    } catch (error) {
      console.error(error);
      toast.error("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8 lg:grid-cols-3">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">

            {/* Shipping Address */}
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>

              <div className="grid gap-4 sm:grid-cols-2">

                <div className="sm:col-span-2">
                  <Label>Full Name</Label>
                  <Input
                    value={address.fullName}
                    onChange={(e) =>
                      setAddress({ ...address, fullName: e.target.value })
                    }
                  />
                </div>

                <div className="sm:col-span-2">
                  <Label>Street Address</Label>
                  <Input
                    value={address.street}
                    onChange={(e) =>
                      setAddress({ ...address, street: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>City</Label>
                  <Input
                    value={address.city}
                    onChange={(e) =>
                      setAddress({ ...address, city: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>State</Label>
                  <Input
                    value={address.state}
                    onChange={(e) =>
                      setAddress({ ...address, state: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>ZIP Code</Label>
                  <Input
                    value={address.zipCode}
                    onChange={(e) =>
                      setAddress({ ...address, zipCode: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Phone</Label>
                  <Input
                    type="tel"
                    value={address.phone}
                    onChange={(e) =>
                      setAddress({ ...address, phone: e.target.value })
                    }
                  />
                </div>

              </div>
            </div>

            {/* Payment */}
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>

                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="credit-card" id="credit-card" />
                  <Label htmlFor="credit-card" className="flex items-center gap-2 cursor-pointer">
                    <CreditCard className="h-5 w-5" />
                    Credit Card
                  </Label>
                </div>

                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal" className="cursor-pointer">
                    PayPal
                  </Label>
                </div>

              </RadioGroup>

              <p className="text-xs text-muted-foreground mt-4">
                This is a demo. No real payment will be processed.
              </p>
            </div>

          </div>

          {/* RIGHT SIDE (SUMMARY) */}
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 space-y-4 sticky top-20">

              <h2 className="text-xl font-bold">Order Summary</h2>

              <div className="space-y-2 text-sm">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-muted-foreground">
                      {item.product.name} x{item.quantity}
                    </span>
                    <span>
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2 text-sm">

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

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Processing...' : 'Place Order'}
              </Button>

            </div>
          </div>

        </div>
      </form>
    </div>
  );
};
