import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userVazio } from "../models/User";
import { registerUser as registerApi, updateUser as updateApi } from "../service/userService";
import { useToast } from "../../../shared/utils/useToast";

export function useUser() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [user, setUser] = useState(userVazio);
    const [photoFile, setPhotoFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const registerUser = async () => {
        setLoading(true);
        try {
            const retorno = await registerApi(user, photoFile);

            if (!retorno.sucesso) {
                showToast(retorno.mensagem || "Erro ao cadastrar usuário", "error");
                return retorno;
            }

            showToast("Usuário cadastrado com sucesso!", "success");
            navigate("/login");
            return retorno;
        } catch (error) {
            showToast(error.message || "Erro ao cadastrar usuário", "error");
            return { sucesso: false, mensagem: error.message };
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (id, payload) => {
        setLoading(true);
        try {
            const userData = {
                name: payload.name,
                email: payload.email,
                currentPassword: payload.currentPassword,
                password: payload.password,
                password_confirm: payload.password_confirm
            };

            const retorno = await updateApi(id, userData, photoFile);

            if (!retorno.sucesso) {
                showToast(retorno.mensagem || "Erro ao atualizar usuário", "error");
                return retorno;
            }

            showToast("Usuário atualizado com sucesso!", "success");
            return retorno;
        } catch (error) {
            showToast(error.message || "Erro ao atualizar usuário", "error");
            return { sucesso: false, mensagem: error.message };
        } finally {
            setLoading(false);
        }
    };

    return {
        registerUser,
        updateUser,
        user,
        setUser,
        photoFile,
        setPhotoFile,
        loading
    };
}