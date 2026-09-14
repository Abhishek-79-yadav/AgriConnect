import {
  configureStore,
  combineReducers,
} from "@reduxjs/toolkit";

import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import createWebStorage from "redux-persist/es/storage/createWebStorage";

// ================= STORAGE =================

const storage = createWebStorage("local");

// ================= SLICES =================

import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";
import orderReducer from "./slices/orderSlice";
import paymentReducer from "./slices/paymentSlice";
import notificationReducer from "./slices/notificationSlice";
import dashboardReducer from "./slices/dashboardSlice";
import farmerReducer from "./slices/farmerSlice";
import adminReducer from "./slices/adminSlice";
import weatherReducer from "./slices/weatherSlice";
import cropReducer from "./slices/cropSlice";
import couponReducer from "./slices/couponSlice";
import ratingReducer from "./slices/ratingSlice";
import schemeReducer from "./slices/schemeSlice";
import searchReducer from "./slices/searchSlice";
import cropHistoryReducer from "./slices/cropHistorySlice";
import returnReducer from "./slices/returnSlice";
import walletReducer from "./slices/walletSlice";
import emiReducer from "./slices/emiSlice";

// ================= ROOT REDUCER =================

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  products: productReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  orders: orderReducer,
  payment: paymentReducer,
  notification: notificationReducer,
  dashboard: dashboardReducer,
  farmer: farmerReducer,
  admin: adminReducer,
  weather: weatherReducer,
  crop: cropReducer,
  coupon: couponReducer,
  rating: ratingReducer,
  scheme: schemeReducer,
  search: searchReducer,
  cropHistory: cropHistoryReducer,
  returns: returnReducer,
  wallet: walletReducer,
  emi: emiReducer,
});

// ================= PERSIST CONFIG =================

// "auth" is deliberately NOT in this whitelist: authSlice's initialState
// already reads token/user from localStorage directly via utils/storage.js,
// and that same module is what persists them on login. Also persisting the
// "auth" slice here would write a second, independent copy of the tokens
// into localStorage under a different key ("persist:root") — redundant,
// and one more place a stale/out-of-sync token could be read from.
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: [
    "user",
    "cart",
    "wishlist",
  ],
};

// ================= PERSIST REDUCER =================

const persistedReducer = persistReducer(
  persistConfig,
  rootReducer
);

// ================= STORE =================

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
      },
    }),

  // Never ship Redux DevTools in a production build — it exposes the
  // entire client-side state tree (including user/cart data) to anyone
  // with the browser extension installed.
  devTools: import.meta.env.DEV,
});

// ================= PERSISTOR =================

export const persistor =
  persistStore(store);

export default store;