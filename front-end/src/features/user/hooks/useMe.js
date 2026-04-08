import { useEffect, useState } from "react";
import { getMe } from "../service/userService";

export function useMe() {
    const [user, setUser] = useState(null);
    const [loadingMe, setLoadingMe] = useState(true);
    const [errorMe, setErrorMe] = useState("");

    useEffect(() => {
        let alive = true;

        async function load() {
            setLoadingMe(true);
            setErrorMe("");

            const r = await getMe();

            if (!alive) return;

            if (!r?.sucesso) {
                setErrorMe(r?.mensagem || "Erro ao carregar usuário");
                setLoadingMe(false);
                return;
            }

            setUser(r.dados);
            setLoadingMe(false);
        }

        load();

        return () => {
            alive = false;
        };
    }, []);

    return { user, loadingMe, errorMe };
}