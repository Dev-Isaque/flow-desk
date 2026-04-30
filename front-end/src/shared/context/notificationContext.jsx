import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import { useToast } from "../utils/useToast";
import { useAuth } from "../../features/auth/hooks/useAuth";
import {
  acceptWorkspaceInvitation,
  declineWorkspaceInvitation,
  listPendingWorkspaceInvitations,
} from "../../features/wokspace/service/workspaceService";

const API_BASE_URL = "http://localhost:8080";
const WS_BASE_URL = API_BASE_URL.replace(/^http/, "ws");

export const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { showToast } = useToast();
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef(null);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  }, []);

  const normalizeNotification = useCallback((payload) => {
    const invitationId = payload.invitationId || payload.id;
    const id = invitationId
      ? `workspace-invite-${invitationId}`
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    return {
      id,
      invitationId,
      workspaceId: payload.workspaceId,
      workspaceName: payload.workspaceName,
      workspaceColor: payload.workspaceColor,
      invitedByName: payload.invitedByName,
      type: payload.type || "info",
      message: payload.message || "Nova notificação",
      createdAt: payload.createdAt || new Date().toISOString(),
      read: false,
    };
  }, []);

  const mergeNotifications = useCallback((items) => {
    setNotifications((prev) => {
      const byId = new Map();
      [...items, ...prev].forEach((item) => {
        if (!byId.has(item.id)) {
          byId.set(item.id, item);
        }
      });

      return Array.from(byId.values())
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 30);
    });
  }, []);

  const refreshInvitations = useCallback(async () => {
    if (!token) return;

    const response = await listPendingWorkspaceInvitations();
    if (!response?.sucesso) return;

    const pending = (response.dados || []).map((invite) =>
      normalizeNotification({
        type: "workspace_invite",
        message: `${invite.invitedByName} convidou você para o workspace "${invite.workspaceName}".`,
        invitationId: invite.id,
        workspaceId: invite.workspaceId,
        workspaceName: invite.workspaceName,
        workspaceColor: invite.workspaceColor,
        invitedByName: invite.invitedByName,
        createdAt: invite.createdAt,
      }),
    );

    mergeNotifications(pending);
  }, [mergeNotifications, normalizeNotification, token]);

  const resolveInvitation = useCallback(
    async (invitationId, action) => {
      if (!invitationId) return false;

      const response =
        action === "accept"
          ? await acceptWorkspaceInvitation(invitationId)
          : await declineWorkspaceInvitation(invitationId);

      if (!response?.sucesso) {
        showToast(response?.mensagem || "Não foi possível responder ao convite.", "error");
        return false;
      }

      setNotifications((prev) =>
        prev.filter((item) => item.invitationId !== invitationId),
      );

      showToast(
        action === "accept" ? "Convite aceito com sucesso!" : "Convite recusado.",
        action === "accept" ? "success" : "info",
      );

      window.dispatchEvent(
        new CustomEvent("workspace-invitation:resolved", {
          detail: { invitationId, action, invitation: response.dados },
        }),
      );

      return true;
    },
    [showToast],
  );

  useEffect(() => {
    let isAlive = true;

    async function connect() {
      if (!token) return;

      let userId = null;
      const rawUser = localStorage.getItem("user");

      if (rawUser) {
        try {
          userId = JSON.parse(rawUser)?.id ?? null;
        } catch {
          userId = null;
        }
      }

      if (!userId) {
        try {
          const response = await fetch(`${API_BASE_URL}/users/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
            credentials: "include",
          });
          const me = await response.json();
          userId = me?.id ?? null;
          if (userId) {
            localStorage.setItem("user", JSON.stringify(me));
          }
        } catch {
          userId = null;
        }
      }

      if (!isAlive || !userId) return;

      const client = new Client({
        brokerURL: `${WS_BASE_URL}/ws`,
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        reconnectDelay: 5000,
        debug: () => {},
      });

      client.onConnect = () => {
        setIsConnected(true);
        client.subscribe(`/topic/users/${userId}/notifications`, (message) => {
          if (!message?.body) return;
          try {
            const payload = JSON.parse(message.body);
            const normalized = normalizeNotification(payload);

            mergeNotifications([normalized]);
            showToast(normalized.message, "success");
          } catch {
            // Ignore malformed notifications.
          }
        });
      };

      client.onDisconnect = () => {
        setIsConnected(false);
      };

      client.activate();
      clientRef.current = client;
    }

    connect();
    refreshInvitations().catch(() => {});

    return () => {
      isAlive = false;
      setIsConnected(false);
      clientRef.current?.deactivate();
    };
  }, [mergeNotifications, normalizeNotification, refreshInvitations, showToast, token]);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications]
  );

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      isConnected,
      markAllAsRead,
      acceptInvitation: (invitationId) => resolveInvitation(invitationId, "accept"),
      declineInvitation: (invitationId) => resolveInvitation(invitationId, "decline"),
      refreshInvitations,
    }),
    [notifications, unreadCount, isConnected, markAllAsRead, refreshInvitations, resolveInvitation]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}
