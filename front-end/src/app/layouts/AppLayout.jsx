import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";

import { Sidebar } from "../../shared/components/Sidebar";
import { Button } from "../../shared/components/Button";
import { ToastNotification } from "../../shared/components/ToastNotification";

import { useToast } from "../../shared/utils/useToast";

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast, closeToast } = useToast();

  function toggleSidebar() {
    setSidebarOpen((prev) => !prev);
  }

  function closeSidebar() {
    setSidebarOpen(false);
  }

  return (
    <div className="app-shell">
      <Sidebar isOpen={sidebarOpen} onNavigate={closeSidebar} />

      {sidebarOpen && (
        <div className="sidebar-overlay d-lg-none" onClick={closeSidebar} />
      )}

      <main className="w-100 position-relative">
        <header className="mobile-topbar d-lg-none d-flex justify-content-between align-items-center px-3">
          <button className="icon-btn" onClick={toggleSidebar}>
            <Menu size={20} />
          </button>

          <span className="fw-semibold">FlowDesk</span>
        </header>

        <div className="app-content">
          <Outlet />
        </div>
      </main>

      <ToastNotification toast={toast} onClose={closeToast} />
    </div>
  );
}
