import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

import { AuthLayout } from "../../../app/layouts/AuthLayout";
import { Button } from "../../../shared/components/Button";
import { Spinner } from "../../../shared/components/Spinner";
import { Input } from "../../../shared/components/Input";

function Login() {
  const { login, user, setUser } = useAuth();
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setUser((prev) => ({ ...(prev || {}), [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMensagem("");

    if (!user?.email?.trim() || !user?.password?.trim()) {
      setMensagem("Preencha email e senha.");
      return;
    }

    setLoading(true);

    const r = await login(user.email, user.password);

    setTimeout(() => {
      setLoading(false);
      if (!r.sucesso) setMensagem(r.mensagem);
    }, 800);
  }

  return (
    <AuthLayout
      title="Bem-vindo de volta!"
      subtitle="Faça login para continuar"
    >
      <form onSubmit={handleSubmit}>
        <div className="auth-inputs">
          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="Digite seu email"
            value={user?.email || ""}
            onChange={handleChange}
          />

          <Input
            label="Senha"
            type="password"
            name="password"
            placeholder="Digite sua senha"
            value={user?.password || ""}
            onChange={handleChange}
          />
        </div>

        <div className="auth-footer">
          <p>
            Esqueceu sua senha? <Link to="/reset">Redefinir</Link>
          </p>
          <p>
            Não tem conta? <Link to="/register">Cadastre-se aqui</Link>
          </p>
        </div>

        <Button type="submit" className="auth-btn" disabled={loading}>
          {loading ? <Spinner /> : "Login"}
        </Button>

        {mensagem && <p className="auth-error">{mensagem}</p>}
      </form>
    </AuthLayout>
  );
}

export default Login;
