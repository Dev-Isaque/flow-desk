import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  User,
  CalendarDays,
  Users,
  LogOut,
  FileChartColumnIncreasing,
  Pen,
  Lock,
} from "lucide-react";

import { useAuth } from "../../features/auth/hooks/useAuth";
import { useMe } from "../../features/user/hooks/useMe";
import Logo from "../assets/images/logo.png";

import { useState, useRef, useEffect } from "react";

export function Sidebar({ isOpen, onNavigate }) {
  const { logout } = useAuth();
  const { user, loadingMe } = useMe();
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  const linkClass = ({ isActive }) =>
    `sidebar-link ${isActive ? "active" : ""}`;

  function handleNavigate() {
    if (onNavigate) onNavigate();
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <aside className={`app-sidebar d-flex flex-column ${isOpen ? "open" : ""}`}>
      <div className="sidebar-top d-flex align-items-center gap-2 px-3 py-3">
        <img src={Logo} alt="FlowDesk" className="sidebar-logo" />
      </div>

      <nav className="sidebar-nav px-2">
        <NavLink to="/home" className={linkClass} onClick={handleNavigate}>
          <LayoutGrid size={18} />
          <span>Início</span>
        </NavLink>

        <NavLink to="/personal" className={linkClass} onClick={handleNavigate}>
          <User size={18} />
          <span>Pessoal</span>
        </NavLink>

        <NavLink to="/calendar" className={linkClass} onClick={handleNavigate}>
          <CalendarDays size={18} />
          <span>Calendário</span>
        </NavLink>

        <NavLink to="/groups" className={linkClass} onClick={handleNavigate}>
          <Users size={18} />
          <span>Grupos</span>
        </NavLink>

        <NavLink to="/reports" className={linkClass} onClick={handleNavigate}>
          <FileChartColumnIncreasing size={18} />
          <span>Relatórios</span>
        </NavLink>
      </nav>

      <div
        className="sidebar-footer mt-auto px-3 py-3 position-relative"
        ref={menuRef}
      >
        <div
          className="sidebar-user mt-3 d-flex align-items-center gap-2"
          onClick={() => setOpenMenu((prev) => !prev)}
          style={{ cursor: "pointer" }}
        >
          <div className="avatar">
            {loadingMe ? "..." : user?.name?.charAt(0)?.toUpperCase()}
          </div>

          <div className="small flex-grow-1">
            <div className="fw-semibold">
              {loadingMe ? "Carregando..." : user?.name || ""}
            </div>
            <div className="theme-text-muted">
              {loadingMe ? "" : user?.email || ""}
            </div>
          </div>
        </div>

        {openMenu && (
          <div className="profile-menu">
            <button
              className="profile-item"
              onClick={() => {
                navigate("/profile");
                setOpenMenu(false);
              }}
            >
              <Pen size={16} />
              <span>Editar perfil</span>
            </button>

            <button className="profile-item">
              <Lock size={16} />
              <span>Alterar senha</span>
            </button>

            <button
              className="profile-item text-danger"
              onClick={() => {
                logout();
                setOpenMenu(false);
              }}
            >
              <LogOut size={16} />
              <span>Sair</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
