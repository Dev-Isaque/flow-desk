import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userVazio } from "../models/User";
import { cadastrar as cadastrarApi } from "../service/userService";

export function useUser() {
    const navigate = useNavigate();

    const [user, setUser] = useState(userVazio);

    const cadastrar = async () => {
        const retorno = await cadastrarApi(user);

        if (!retorno.sucesso) return retorno;

        navigate("/login");

        return retorno;
    };

    return {
        cadastrar,
        user,
        setUser
    };
}