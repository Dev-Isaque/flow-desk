import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../../features/auth/service/authService";
import { getMe } from "../../features/user/service/userService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const isAuthenticated = !!token && !!user;

  const login = async (email, password) => {
    if (!email || !password) {
      return { sucesso: false, mensagem: "Preencha email e senha" };
    }

    const retorno = await loginApi({ email, password });
    if (!retorno.sucesso) return retorno;

    const { token } = retorno.dados;

    localStorage.setItem("token", token);
    localStorage.removeItem("user");
    setToken(token);
    const me = await getMe();
    if (!me?.sucesso) {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      return { sucesso: false, mensagem: "Sessão inválida. Faça login novamente." };
    }
    localStorage.setItem("user", JSON.stringify(me.dados));
    setUser(me.dados);
    navigate("/home", { replace: true });
    return retorno;
  };

  const logout = useCallback((shouldNavigate = true) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setToken(null);

    if (shouldNavigate) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    let mounted = true;

    async function bootstrapAuth() {
      if (!token) {
        if (mounted) setIsBootstrapping(false);
        return;
      }

      const me = await getMe();
      if (!mounted) return;

      if (!me?.sucesso) {
        logout(false);
      } else {
        setUser(me.dados);
        localStorage.setItem("user", JSON.stringify(me.dados));
      }
      setIsBootstrapping(false);
    }

    bootstrapAuth();

    return () => {
      mounted = false;
    };
  }, [token, logout]);

  useEffect(() => {
    function handleUnauthorized() {
      logout();
    }

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [logout]);

  const value = useMemo(
    () => ({ user, token, login, logout, setUser, isAuthenticated, isBootstrapping }),
    [user, token, isAuthenticated, isBootstrapping, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
