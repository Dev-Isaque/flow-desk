import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userVazio } from "../models/User";
import { registerUser as registerApi, updateUser as updateApi } from "../service/userService";

export function useUser() {
    const navigate = useNavigate();
    const [user, setUser] = useState(userVazio);
    const [photoFile, setPhotoFile] = useState(null);

    const registerUser = async () => {
        const retorno = await registerApi(user, photoFile);
        if (!retorno.sucesso) return retorno;
        navigate("/login");
        return retorno;
    };

    const updateUser = async (id) => {
        const retorno = await updateApi(id, user, photoFile);
        return retorno;
    };

    return {
        registerUser,
        updateUser,
        user,
        setUser,
        photoFile,
        setPhotoFile
    };
}