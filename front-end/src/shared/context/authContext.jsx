import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../../features/auth/service/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const isAuthenticated = !!token;

  const login = async (email, password) => {
    if (!email || !password) {
      return { sucesso: false, mensagem: "Preencha email e senha" };
    }

    const retorno = await loginApi({ email, password });
    if (!retorno.sucesso) return retorno;

    const { token } = retorno.dados;

    localStorage.setItem("token", token);

    setToken(token);

    navigate("/home");
    return retorno;
  };

  const logout = () => {
    localStorage.removeItem("token");

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
