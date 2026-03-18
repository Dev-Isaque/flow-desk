import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../../features/auth/service/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const isAuthenticated = !!token;

  const login = async (email, password) => {
    if (!email || !password)
      return { sucesso: false, mensagem: "Preencha email e senha" };

    const retorno = await loginApi({ email, password });
    if (!retorno.sucesso) return retorno;

    const { token, usuario } = retorno.dados;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(usuario));

    setUser(usuario);
    setToken(token);

    navigate("/home");
    return retorno;
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, setUser, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
