import { createBrowserRouter } from 'react-router';
import { Layout } from './layouts/Layout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { Categories } from './pages/Categories';
import { SearchResults } from './pages/SearchResults';
import { Deals } from './pages/Deals';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { FAQ } from './pages/FAQ';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';

// User Pages
import { Dashboard } from './pages/user/Dashboard';
import { Profile } from './pages/user/Profile';
import { EditProfile } from './pages/user/EditProfile';
import { Wishlist } from './pages/user/Wishlist';
import { Cart } from './pages/user/Cart';
import { Checkout } from './pages/user/Checkout';
import { OrderSuccess } from './pages/user/OrderSuccess';
import { Orders } from './pages/user/Orders';
import { OrderDetails } from './pages/user/OrderDetails';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageProducts } from './pages/admin/ManageProducts';
import { ManageOrders } from './pages/admin/ManageOrders';
import { ManageUsers } from './pages/admin/ManageUsers';
import { AddProduct } from './pages/admin/AddProduct';
import { EditProduct } from './pages/admin/EditProduct';

// Error Pages
import { NotFound } from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'shop', Component: Shop },
      { path: 'product/:id', Component: ProductDetails },
      { path: 'categories', Component: Categories },
      { path: 'search', Component: SearchResults },
      { path: 'deals', Component: Deals },
      { path: 'about', Component: About },
      { path: 'contact', Component: Contact },
      { path: 'faq', Component: FAQ },
      
      // Auth
      { path: 'login', Component: Login },
      { path: 'register', Component: Register },
      { path: 'forgot-password', Component: ForgotPassword },
      { path: 'reset-password', Component: ResetPassword },
      
      // User
      { path: 'dashboard', Component: Dashboard },
      { path: 'profile', Component: Profile },
      { path: 'profile/edit', Component: EditProfile },
      { path: 'wishlist', Component: Wishlist },
      { path: 'cart', Component: Cart },
      { path: 'checkout', Component: Checkout },
      { path: 'order-success', Component: OrderSuccess },
      { path: 'orders', Component: Orders },
      { path: 'order/:id', Component: OrderDetails },
    ]
  },
  {
    path: '/admin',
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: 'products', Component: ManageProducts },
      { path: 'products/add', Component: AddProduct },
      { path: 'products/edit/:id', Component: EditProduct },
      { path: 'orders', Component: ManageOrders },
      { path: 'users', Component: ManageUsers },
    ]
  },
  {
    path: '*',
    Component: NotFound
  }
]);
