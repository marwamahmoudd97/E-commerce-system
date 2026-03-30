import React from 'react';
import { Link } from 'react-router';
import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div className="space-y-4">
            <h3 className="font-semibold">MusicStore</h3>
            <p className="text-sm text-muted-foreground">
              Your premier destination for quality musical instruments. From guitars to keyboards, we have everything you need to make music.
            </p>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" asChild>
                <a href="#" aria-label="Facebook">
                  <Facebook className="h-4 w-4" />
                </a>
              </Button>
              <Button size="icon" variant="ghost" asChild>
                <a href="#" aria-label="Twitter">
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
              <Button size="icon" variant="ghost" asChild>
                <a href="#" aria-label="Instagram">
                  <Instagram className="h-4 w-4" />
                </a>
              </Button>
              <Button size="icon" variant="ghost" asChild>
                <a href="#" aria-label="YouTube">
                  <Youtube className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h3 className="font-semibold">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/categories" className="text-muted-foreground hover:text-foreground transition-colors">
                  All Categories
                </Link>
              </li>
              <li>
                <Link to="/shop?category=guitars" className="text-muted-foreground hover:text-foreground transition-colors">
                  Guitars
                </Link>
              </li>
              <li>
                <Link to="/shop?category=keyboards" className="text-muted-foreground hover:text-foreground transition-colors">
                  Keyboards
                </Link>
              </li>
              <li>
                <Link to="/shop?category=drums" className="text-muted-foreground hover:text-foreground transition-colors">
                  Drums
                </Link>
              </li>
              <li>
                <Link to="/deals" className="text-muted-foreground hover:text-foreground transition-colors">
                  Special Offers
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Returns Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold">Newsletter</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to get special offers, free giveaways, and updates.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="email"
                placeholder="Your email"
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Mail className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} MusicStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
