import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";

import { Topbar } from "../../shared/components/Topbar";
import { Sidebar } from "../../shared/components/Sidebar";
import { Button } from "../../shared/components/Button";

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function openSidebar() {
    setSidebarOpen(true);
  }

  function closeSidebar() {
    setSidebarOpen(false);
  }

  return (
    <div className="app-shell">
      <div className="d-none d-lg-block">
        <Sidebar />
      </div>

      {sidebarOpen && (
        <>
          <div className="sidebar-overlay d-lg-none" onClick={closeSidebar} />

          <div className="sidebar-mobile d-lg-none">
            <div className="d-flex justify-content-end p-2">
              <button
                className="btn btn-link"
                onClick={closeSidebar}
                aria-label="Fechar menu"
              >
                <X size={22} />
              </button>
            </div>

            <Sidebar onNavigate={closeSidebar} />
          </div>
        </>
      )}

      <main>
        <Button
          className="btn-outline-secondary d-lg-none mb-3"
          onClick={openSidebar}
          aria-label="Abrir menu"
        >
          <Menu size={20} />
        </Button>

        <Topbar />

        <div className="app-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
