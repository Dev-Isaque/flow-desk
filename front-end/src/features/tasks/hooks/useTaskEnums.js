import { useState, useEffect } from 'react';
import { getTaskStatuses, getTaskPriorities } from '../services/taskEnumService';

export function useTaskEnums() {
    const [statuses, setStatuses] = useState([]);
    const [priorities, setPriorities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function loadEnums() {
            try {
                setLoading(true);
                const [statusData, priorityData] = await Promise.all([
                    getTaskStatuses(),
                    getTaskPriorities()
                ]);

                if (isMounted) {
                    setStatuses(statusData || []);
                    setPriorities(priorityData || []);
                }
            } catch (error) {
                console.error("Erro ao carregar enums de tarefas:", error.message);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadEnums();

        return () => { isMounted = false; };
    }, []);

    return { statuses, priorities, loading };
}