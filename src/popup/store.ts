/**
 * Store Zustand para gerenciar estado do popup
 */

import { create } from "zustand";
import { BlockedDomain, BlockingTimer, MessageType, ChromeMessage } from "@/types/index";

interface PopupStore {
    domains: BlockedDomain[];
    timer: BlockingTimer;
    loading: boolean;
    error: string | null;

    // Ações
    loadState: () => Promise<void>;
    addDomain: (domain: string) => Promise<void>;
    removeDomain: (domain: string) => Promise<void>;
    updateTimer: (timer: BlockingTimer) => Promise<void>;
    clearError: () => void;
}

export const usePopupStore = create<PopupStore>((set, get) => ({
    domains: [],
    timer: {
        enabled: false,
        startTime: null,
        duration: 30,
        justificationRequired: true,
    },
    loading: false,
    error: null,

    loadState: async () => {
        set({ loading: true });
        try {
            const response = await new Promise<{
                domains: BlockedDomain[];
                timer: BlockingTimer;
            }>((resolve) => {
                chrome.runtime.sendMessage({ type: MessageType.GET_BLOCKING_STATE } as ChromeMessage, (response) => {
                    resolve(response);
                });
            });

            set({
                domains: response.domains,
                timer: response.timer,
                error: null,
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Erro ao carregar estado";
            set({ error: message });
            console.error("[PopupStore] Erro:", error);
        } finally {
            set({ loading: false });
        }
    },

    addDomain: async (domain: string) => {
        try {
            const normalizedDomain = domain.toLowerCase().trim();

            if (!normalizedDomain || !isValidDomain(normalizedDomain)) {
                set({ error: "Domínio inválido" });
                return;
            }

            if (get().domains.some((d) => d.domain === normalizedDomain)) {
                set({ error: "Este domínio já está bloqueado" });
                return;
            }

            await new Promise<{ success: boolean }>((resolve) => {
                chrome.runtime.sendMessage(
                    {
                        type: MessageType.UPDATE_DOMAINS,
                        payload: { domain: normalizedDomain, action: "add" },
                    } as ChromeMessage,
                    resolve
                );
            });

            // Recarrega o estado
            await get().loadState();
            set({ error: null });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Erro ao adicionar domínio";
            set({ error: message });
            console.error("[PopupStore] Erro ao adicionar domínio:", error);
        }
    },

    removeDomain: async (domain: string) => {
        try {
            await new Promise<{ success: boolean }>((resolve) => {
                chrome.runtime.sendMessage(
                    {
                        type: MessageType.UPDATE_DOMAINS,
                        payload: { domain, action: "remove" },
                    } as ChromeMessage,
                    resolve
                );
            });

            // Recarrega o estado
            await get().loadState();
            set({ error: null });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Erro ao remover domínio";
            set({ error: message });
            console.error("[PopupStore] Erro ao remover domínio:", error);
        }
    },

    updateTimer: async (timer: BlockingTimer) => {
        try {
            await new Promise<{ success: boolean }>((resolve) => {
                chrome.runtime.sendMessage(
                    {
                        type: MessageType.UPDATE_TIMER,
                        payload: timer,
                    } as ChromeMessage,
                    resolve
                );
            });

            set({ timer, error: null });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Erro ao atualizar timer";
            set({ error: message });
            console.error("[PopupStore] Erro ao atualizar timer:", error);
        }
    },

    clearError: () => set({ error: null }),
}));

/**
 * Valida se uma string é um domínio válido
 */
function isValidDomain(domain: string): boolean {
    // Rejeita strings vazias, com espaços, ou muito longas
    if (!domain || domain.length > 253 || domain.includes(" ")) {
        return false;
    }

    // Aceita qualquer domínio que:
    // - Tem pelo menos 2 caracteres
    // - Contém apenas letras, números, hífens e pontos
    // - Não começa nem termina com hífen ou ponto
    const domainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    return domainRegex.test(domain);
}
