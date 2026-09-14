import { Routes, Route } from "react-router-dom";

import ROLES from "../constants/roles";

import RoleRoute from "./RoleRoute";
import PublicRoute from "./PublicRoute";

// Layouts
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import BuyerLayout from "../layouts/BuyerLayout";
import FarmerLayout from "../layouts/FarmerLayout";
import AdminLayout from "../layouts/AdminLayout";

// Public pages
import Home from "../pages/public/Home";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import RegisterBrand from "../pages/public/RegisterBrand";
import About from "../pages/public/About";
import Contact from "../pages/public/Contact";
import HelpCenter from "../pages/public/HelpCenter";
import ForgotPassword from "../pages/public/ForgotPassword";
import ResetPassword from "../pages/public/ResetPassword";
import VerifyEmail from "../pages/public/VerifyEmail";
import VerifyOtp from "../pages/public/VerifyOtp";

// Shared / cross-role pages
import Products from "../pages/buyer/Products";
import ProductDetails from "../pages/buyer/ProductDetails";
import Search from "../pages/search/Search";
import Profile from "../pages/profile/Profile";
import EditProfile from "../pages/profile/EditProfile";
import ChangePassword from "../pages/profile/ChangePassword";
import AccountSettings from "../pages/profile/AccountSettings";

// Buyer pages
import BuyerDashboard from "../pages/buyer/Dashboard";
import Cart from "../pages/buyer/Cart";
import Wishlist from "../pages/buyer/Wishlist";
import Checkout from "../pages/buyer/Checkout";
import BuyerOrders from "../pages/buyer/Orders";
import Coupons from "../pages/buyer/Coupons";
import Wallet from "../pages/buyer/Wallet";
import BuyerNotifications from "../pages/buyer/Notifications";
import PaymentSuccess from "../pages/buyer/PaymentSuccess";
import PaymentFailed from "../pages/buyer/PaymentFailed";
import PhonePeCallback from "../pages/buyer/PhonePeCallback";

// Farmer pages
import FarmerDashboard from "../pages/farmer/Dashboard";
import MyProducts from "../pages/farmer/MyProducts";
import AddProduct from "../pages/farmer/AddProduct";
import EditProduct from "../pages/farmer/EditProduct";
import FarmerOrders from "../pages/farmer/Orders";
import FarmerReviews from "../pages/farmer/Reviews";
import FarmerAnalytics from "../pages/farmer/Analytics";
import Revenue from "../pages/farmer/Revenue";
import Weather from "../pages/farmer/Weather";
import SmartCrop from "../pages/farmer/SmartCrop";
import AIRecommendation from "../pages/farmer/AIRecommendation";
import UploadVideo from "../pages/farmer/UploadVideo";
import FarmLog from "../pages/farmer/FarmLog";
import FarmerSchemes from "../pages/farmer/Schemes";
import FarmerWarehouseLicenses from "../pages/farmer/WarehouseLicenses";
import FarmerNotifications from "../pages/farmer/Notifications";
import BrandDashboard from "../pages/brand/Dashboard";
import BrandAgriInputs from "../pages/brand/AgriInputs";
import Plans from "../pages/shared/Plans";
import GovernmentDashboard from "../pages/government/Dashboard";
import GovernmentDepartments from "../pages/government/Departments";
import GovernmentSchemes from "../pages/government/Schemes";
import GovernmentApplications from "../pages/government/Applications";
import GovernmentLicenses from "../pages/government/Licenses";
import GovernmentTaxRecords from "../pages/government/TaxRecords";
import GovernmentTaxConfig from "../pages/government/TaxConfig";
import GovernmentNotices from "../pages/government/Notices";
import GovernmentAuditTrail from "../pages/government/AuditTrail";
import AgriInputsBrowse from "../pages/buyer/AgriInputsBrowse";

// Admin pages
import AdminDashboard from "../pages/admin/Dashboard";
import AdminUsers from "../pages/admin/Users";
import AdminProducts from "../pages/admin/Products";
import AdminOrders from "../pages/admin/Orders";
import AdminCampaigns from "../pages/admin/Campaigns";
import AdminCoupons from "../pages/admin/Coupons";
import AdminSchemes from "../pages/admin/Schemes";
import AdminReports from "../pages/admin/Reports";
import AdminPayouts from "../pages/admin/Payouts";
import AdminPendingBrands from "../pages/admin/PendingBrands";
import ManageAdmins from "../pages/admin/ManageAdmins";
import ManageGovernmentOfficials from "../pages/admin/ManageGovernmentOfficials";
import Governance from "../pages/admin/Governance";
import AdminAnalytics from "../pages/admin/Analytics";
import AdminNotifications from "../pages/admin/Notifications";
import AdminSettings from "../pages/admin/Settings";

// Error pages
import NotFound from "../pages/errors/NotFound";
import Unauthorized from "../pages/errors/Unauthorized";
import ServerError from "../pages/errors/ServerError";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ---------- Public (with Navbar + Footer) ---------- */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/search" element={<Search />} />

        {/* ---------- Shared authenticated pages (any role) ---------- */}
        <Route
          path="/profile"
          element={
            <RoleRoute>
              <Profile />
            </RoleRoute>
          }
        />
        <Route
          path="/profile/edit"
          element={
            <RoleRoute>
              <EditProfile />
            </RoleRoute>
          }
        />
        <Route
          path="/profile/change-password"
          element={
            <RoleRoute>
              <ChangePassword />
            </RoleRoute>
          }
        />
        <Route
          path="/profile/account-settings"
          element={
            <RoleRoute>
              <AccountSettings />
            </RoleRoute>
          }
        />

        {/* ---------- Errors ---------- */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/server-error" element={<ServerError />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Logged-in users get bounced to their dashboard instead of
          seeing these again — see PublicRoute. */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-brand" element={<RegisterBrand />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
        </Route>
      </Route>

      {/* ---------- Buyer ---------- */}
      <Route
        path="/buyer"
        element={
          <RoleRoute allowedRoles={[ROLES.BUYER]}>
            <BuyerLayout />
          </RoleRoute>
        }
      >
        <Route path="dashboard" element={<BuyerDashboard />} />
        <Route path="cart" element={<Cart />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="orders" element={<BuyerOrders />} />
        <Route path="wallet" element={<Wallet />} />
        <Route path="coupons" element={<Coupons />} />
        <Route path="agri-inputs" element={<AgriInputsBrowse />} />
        <Route path="plans" element={<Plans />} />
        <Route path="notifications" element={<BuyerNotifications />} />
        <Route path="payment/success" element={<PaymentSuccess />} />
        <Route path="payment/failed" element={<PaymentFailed />} />
        <Route path="payment/phonepe/callback" element={<PhonePeCallback />} />
      </Route>

      {/* ---------- Farmer ---------- */}
      <Route
        path="/farmer"
        element={
          <RoleRoute allowedRoles={[ROLES.FARMER]}>
            <FarmerLayout />
          </RoleRoute>
        }
      >
        <Route path="dashboard" element={<FarmerDashboard />} />
        <Route path="products" element={<MyProducts />} />
        <Route path="products/add" element={<AddProduct />} />
        <Route path="products/:id/edit" element={<EditProduct />} />
        <Route path="orders" element={<FarmerOrders />} />
        <Route path="reviews" element={<FarmerReviews />} />
        <Route path="analytics" element={<FarmerAnalytics />} />
        <Route path="revenue" element={<Revenue />} />
        <Route path="weather" element={<Weather />} />
        <Route path="smart-crop" element={<SmartCrop />} />
        <Route path="ai-recommendation" element={<AIRecommendation />} />
        <Route path="upload-video" element={<UploadVideo />} />
        <Route path="farm-log" element={<FarmLog />} />
        <Route path="schemes" element={<FarmerSchemes />} />
        <Route path="warehouse-licenses" element={<FarmerWarehouseLicenses />} />
        <Route path="notifications" element={<FarmerNotifications />} />
      </Route>

      {/* ---------- Brand (fertilizer/pesticide companies) ---------- */}
      <Route
        path="/brand"
        element={
          <RoleRoute allowedRoles={[ROLES.BRAND]}>
            <FarmerLayout />
          </RoleRoute>
        }
      >
        <Route path="dashboard" element={<BrandDashboard />} />
        <Route path="agri-inputs" element={<BrandAgriInputs />} />
        <Route path="plans" element={<Plans />} />
      </Route>

      {/* ---------- Government ---------- */}
      <Route
        path="/government"
        element={
          <RoleRoute allowedRoles={[ROLES.GOVERNMENT]}>
            <FarmerLayout />
          </RoleRoute>
        }
      >
        <Route path="dashboard" element={<GovernmentDashboard />} />
        <Route path="reports" element={<GovernmentDashboard />} />
        <Route path="departments" element={<GovernmentDepartments />} />
        <Route path="schemes" element={<GovernmentSchemes />} />
        <Route path="applications" element={<GovernmentApplications />} />
        <Route path="licenses" element={<GovernmentLicenses />} />
        <Route path="tax-records" element={<GovernmentTaxRecords />} />
        <Route path="tax-config" element={<GovernmentTaxConfig />} />
        <Route path="notices" element={<GovernmentNotices />} />
        <Route path="audit-trail" element={<GovernmentAuditTrail />} />
      </Route>

      {/* ---------- Admin ---------- */}
      <Route
        path="/admin"
        element={
          <RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
            <AdminLayout />
          </RoleRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="campaigns" element={<AdminCampaigns />} />
        <Route path="coupons" element={<AdminCoupons />} />
        <Route path="schemes" element={<AdminSchemes />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="payouts" element={<AdminPayouts />} />
        <Route path="pending-brands" element={<AdminPendingBrands />} />
        <Route path="manage-admins" element={<ManageAdmins />} />
        <Route path="government-officials" element={<ManageGovernmentOfficials />} />
        <Route path="governance" element={<Governance />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

    </Routes>
  );
}
