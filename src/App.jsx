import AppRoutes from "./routes/AppRoutes";

import ScrollToTop from "./components/common/ScrollToTop";
import BackButtonHandler from "./components/common/BackButtonHandler";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <BackButtonHandler />

      <AppRoutes />
    </>
  );
}