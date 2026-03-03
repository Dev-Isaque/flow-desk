import { useCallback, useEffect, useState } from "react";
import {
    listAttachments,
    uploadAttachment,
    deleteAttachment,
    downloadAttachmentFile, // <-- IMPORTADO AQUI
} from "../services/attachmentService";

export function useTaskAttachments(taskId) {
    const [attachments, setAttachments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const loadAttachments = useCallback(async () => {
        if (!taskId) return;

        try {
            setLoading(true);
            const data = await listAttachments(taskId);
            setAttachments(data);
        } finally {
            setLoading(false);
        }
    }, [taskId]);

    useEffect(() => {
        loadAttachments();
    }, [loadAttachments]);

    const upload = async (file) => {
        try {
            setUploading(true);
            const newAttachment = await uploadAttachment(taskId, file);
            setAttachments((prev) => [...prev, newAttachment]);
            return newAttachment;
        } finally {
            setUploading(false);
        }
    };

    const remove = async (attachmentId) => {
        await deleteAttachment(taskId, attachmentId);
        setAttachments((prev) =>
            prev.filter((a) => a.id !== attachmentId)
        );
    };

    // --- NOVA FUNÇÃO NO HOOK ---
    const download = async (attachmentId, originalFileName) => {
        try {
            await downloadAttachmentFile(taskId, attachmentId, originalFileName);
        } catch (error) {
            console.error(error.message);
            alert("Não foi possível fazer o download do arquivo.");
        }
    };

    return {
        attachments,
        loading,
        uploading,
        loadAttachments,
        upload,
        remove,
        download, // <-- DISPONIBILIZADO AQUI
    };
}