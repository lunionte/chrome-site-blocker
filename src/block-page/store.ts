/**
 * Store para a página de bloqueio
 */

import { create } from "zustand";
import { BlockingJustification, MessageType, ChromeMessage } from "@/types/index";

interface BlockPageState {
    step: "warning" | "form" | "confirmation" | "submitted";
    domain: string;
    targetUrl: string;
    reason: string;
    puzzleCompleted: boolean;
    loading: boolean;
    error: string | null;

    setStep: (step: BlockPageState["step"]) => void;
    setReason: (reason: string) => void;
    setPuzzleCompleted: (completed: boolean) => void;
    submitJustification: () => Promise<void>;
    goBack: () => void;
    clearError: () => void;
}

export const useBlockPageStore = create<BlockPageState>((set, get) => ({
    step: "warning",
    domain: "",
    targetUrl: "",
    reason: "",
    puzzleCompleted: false,
    loading: false,
    error: null,

    setStep: (step) => set({ step }),

    setReason: (reason) => set({ reason }),

    setPuzzleCompleted: (completed) => set({ puzzleCompleted: completed }),

    submitJustification: async () => {
        const { domain, reason, targetUrl } = get();

        if (!reason.trim()) {
            set({ error: "Por favor, forneça uma justificativa" });
            return;
        }

        set({ loading: true });

        try {
            const justification: BlockingJustification = {
                timestamp: Date.now(),
                reason: reason.trim(),
                domain,
                justified: true,
            };

            await new Promise<{ success: boolean }>((resolve) => {
                chrome.runtime.sendMessage(
                    {
                        type: MessageType.SUBMIT_JUSTIFICATION,
                        payload: justification,
                    } as ChromeMessage,
                    (response) => {
                        resolve(response);
                    }
                );
            });

            set({ step: "submitted", error: null });

            // Redireciona após 2 segundos
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 2000);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Erro ao enviar justificativa";
            set({ error: message });
            console.error("[BlockPage] Erro:", error);
        } finally {
            set({ loading: false });
        }
    },

    goBack: () => {
        window.history.back();
    },

    clearError: () => set({ error: null }),
}));
