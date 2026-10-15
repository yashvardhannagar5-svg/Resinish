import { lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import Layout from './components/Layout'
import Home from './pages/Home'

// Home ships in the main bundle; every other page is loaded on demand.
const Shop = lazy(() => import('./pages/Shop'))
const ProductDetails = lazy(() => import('./pages/ProductDetails'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'))
const InfoPage = lazy(() => import('./pages/InfoPage'))
const NotFound = lazy(() => import('./pages/NotFound'))

const Login = lazy(() => import('./pages/Login'))
const OrderTracking = lazy(() => import('./pages/OrderTracking'))
const infoPages = ['about', 'support', 'shipping', 'returns', 'privacy', 'terms', 'account']

export default function App() {
  return (
    // Framer Motion follows the OS "reduce motion" setting.
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="product/:slug" element={<ProductDetails />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order-success" element={<OrderSuccess />} />
            <Route path="login" element={<Login />} />
            <Route path="track-order" element={<OrderTracking />} />
            {infoPages.map((page) => (
              <Route key={page} path={page} element={<InfoPage page={page} />} />
            ))}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  )
}
