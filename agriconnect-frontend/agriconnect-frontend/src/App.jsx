import AppRoutes from "./routes/AppRoutes";

import ScrollToTop from "./components/common/ScrollToTop";

export default function App() {
  return (
    <>
      <ScrollToTop />

      <AppRoutes />
    </>
  );
}