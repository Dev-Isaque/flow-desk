import { useCallback, useEffect, useState } from "react";
import { useToast } from "../../../shared/utils/useToast";

import {
    listAttachments,
    uploadAttachment,
    deleteAttachment,
    downloadAttachmentFile,
    previewAttachmentFile,
} from "../services/attachmentService";

export function useTaskAttachments(taskId) {
    const { showToast } = useToast();

    const [attachments, setAttachments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const loadAttachments = useCallback(async () => {
        if (!taskId) return;

        try {
            setLoading(true);

            const data = await listAttachments(taskId);

            setAttachments(data);
        } catch (error) {
            console.error(error);

            showToast("Erro ao carregar anexos.", "error");
        } finally {
            setLoading(false);
        }
    }, [taskId, showToast]);

    useEffect(() => {
        loadAttachments();
    }, [loadAttachments]);

    const upload = async (file) => {
        try {
            setUploading(true);

            const newAttachment = await uploadAttachment(taskId, file);

            setAttachments((prev) => [...prev, newAttachment]);

            showToast("Arquivo enviado com sucesso!", "success");

            return newAttachment;
        } catch (error) {
            console.error(error);

            showToast("Erro ao enviar arquivo.", "error");
        } finally {
            setUploading(false);
        }
    };

    const remove = async (attachmentId) => {
        try {
            await deleteAttachment(taskId, attachmentId);

            setAttachments((prev) =>
                prev.filter((a) => a.id !== attachmentId)
            );

            showToast("Arquivo removido com sucesso!", "success");
        } catch (error) {
            console.error(error);

            showToast("Erro ao remover arquivo.", "error");
        }
    };

    const download = async (attachmentId, originalFileName) => {
        try {
            await downloadAttachmentFile(taskId, attachmentId, originalFileName);
        } catch (error) {
            console.error(error);

            showToast("Não foi possível fazer o download do arquivo.", "error");
        }
    };

    const preview = async (attachmentId) => {
        try {
            await previewAttachmentFile(taskId, attachmentId);
        } catch (error) {
            console.error(error);

            showToast("Não foi possível visualizar o arquivo.", "error");
        }
    };

    return {
        attachments,
        loading,
        uploading,
        loadAttachments,
        upload,
        remove,
        download,
        preview,
    };
}