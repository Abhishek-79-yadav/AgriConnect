import {
  Outlet,
} from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

export default function DashboardLayout() {
  return (
    <div
      style={{
        display: "flex",
        minHeight:
          "100vh",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
        }}
      >
        <Header
          title="Dashboard"
        />

        <main
          style={{
            padding:
              "20px",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}