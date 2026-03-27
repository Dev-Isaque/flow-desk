import { useEffect, useState } from "react";
import { getMe } from "../service/userService";

export function useMe() {
    const [user, setuser] = useState(null);
    const [loadingMe, setLoadingMe] = useState(true);
    const [errorMe, setErrorMe] = useState("");

    useEffect(() => {
        let alive = true; 
        async function load() {
            if (alive) setLoadingMe(true);
            setErrorMe("");

            const r = await getMe();

            if (!alive) return; 

            if (!r?.sucesso) {
                setErrorMe(r?.mensagem || "Não foi possível carregar o usuário");
                if (alive) setLoadingMe(false);
                return;
            }

            setuser(r.dados);
            if (alive) setLoadingMe(false);
        }

        load();

        return () => {
            alive = false; 
        };
    }, []);

    return { user, loadingMe, errorMe };
}