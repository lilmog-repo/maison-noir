import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import Home from '@/pages/Home';
import Shop from '@/pages/Shop';
import Collections from '@/pages/Collections';
import CollectionDetail from '@/pages/CollectionDetail';
import ProductDetail from '@/pages/ProductDetail';
import Lookbook from '@/pages/Lookbook';
import Stories from '@/pages/Stories';
import StoryDetail from '@/pages/StoryDetail';
import About from '@/pages/About';
import Wishlist from '@/pages/Wishlist';
import Checkout from '@/pages/Checkout';
import CheckoutReturn from '@/pages/CheckoutReturn';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Account from '@/pages/Account';
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminOrders from '@/pages/admin/Orders';
import AdminOrderDetail from '@/pages/admin/OrderDetail';
import AdminProducts from '@/pages/admin/Products';
import AdminProductEdit from '@/pages/admin/ProductEdit';
import AdminTeam from '@/pages/admin/Team';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { AuthProvider } from '@/context/AuthContext';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { RequireAdmin } from '@/components/auth/RequireAdmin';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/shop" component={Shop} />
      <Route path="/collections" component={Collections} />
      <Route path="/collections/:slug" component={CollectionDetail} />
      <Route path="/products/:slug" component={ProductDetail} />
      <Route path="/lookbook" component={Lookbook} />
      <Route path="/stories" component={Stories} />
      <Route path="/stories/:slug" component={StoryDetail} />
      <Route path="/about" component={About} />
      <Route path="/wishlist" component={Wishlist} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/account" component={Account} />
      <Route path="/admin">
        <RequireAdmin>
          <AdminDashboard />
        </RequireAdmin>
      </Route>
      <Route path="/admin/orders">
        <RequireAdmin>
          <AdminOrders />
        </RequireAdmin>
      </Route>
      <Route path="/admin/orders/:id">
        <RequireAdmin>
          <AdminOrderDetail />
        </RequireAdmin>
      </Route>
      <Route path="/admin/products">
        <RequireAdmin>
          <AdminProducts />
        </RequireAdmin>
      </Route>
      <Route path="/admin/products/new">
        <RequireAdmin>
          <AdminProductEdit />
        </RequireAdmin>
      </Route>
      <Route path="/admin/products/:id">
        <RequireAdmin>
          <AdminProductEdit />
        </RequireAdmin>
      </Route>
      <Route path="/admin/team">
        <RequireAdmin>
          <AdminTeam />
        </RequireAdmin>
      </Route>
      <Route path="/checkout/return" component={CheckoutReturn} />
      <Route path="/checkout">
        <RequireAuth>
          <Checkout />
        </RequireAuth>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
                <Router />
              </WouterRouter>
              <Toaster />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
