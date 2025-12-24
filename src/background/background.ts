/**
 * Service Worker (Background Script)
 * Gerencia o estado global do bloqueio e persiste dados
 */

import type { BlockedDomain, BlockingTimer, ChromeMessage, StorageData, BlockingJustification } from "@/types/index";

// Estado em memória durante a execução
const state = {
    blockedDomains: new Map<string, BlockedDomain>(),
    // domain -> { remainingPasses: number, sessionId: string }
    justifications: new Map<string, { remainingPasses: number; sessionId: string }>(),
    blockingTimer: {
        enabled: false,
        startTime: null,
        duration: 30,
        justificationRequired: true,
    } as BlockingTimer,
    timerInterval: null as any,
};

/**
 * Inicializa o estado a partir do storage
 */
async function initializeState(): Promise<void> {
    try {
        const result = await chrome.storage.local.get("blockingState");
        const stored = result.blockingState as Partial<StorageData> | undefined;

        if (stored?.blockedDomains) {
            stored.blockedDomains.forEach((domain) => {
                state.blockedDomains.set(domain.domain, domain);
            });
        }

        if (stored?.blockingTimer) {
            state.blockingTimer = stored.blockingTimer;
            if (state.blockingTimer.enabled && state.blockingTimer.startTime) {
                startTimerCheck();
            }
        }

        console.log("[Service Worker] Estado inicializado:", state);
    } catch (error) {
        console.error("[Service Worker] Erro ao inicializar estado:", error);
    }
}

/**
 * Persiste o estado no storage
 */
async function persistState(): Promise<void> {
    try {
        // Converte justificações para array
        const justificationsArray = Array.from(state.justifications.entries()).map(([domain]) => ({
            domain,
            reason: "", // Será preenchido pelo block-page se necessário
            justified: true,
            timestamp: Date.now(),
        }));

        const storageData: StorageData = {
            blockedDomains: Array.from(state.blockedDomains.values()),
            blockingTimer: state.blockingTimer,
            justifications: justificationsArray,
        };

        await chrome.storage.local.set({ blockingState: storageData });
    } catch (error) {
        console.error("[Service Worker] Erro ao persistir estado:", error);
    }
}

/**
 * Verifica se um domínio está bloqueado
 * Se há passes disponíveis nesta sessão, permite o acesso
 * Se o timer global expirou, nenhum domínio é bloqueado
 */
function isDomainBlocked(domain: string): boolean {
    const normalizedDomain = domain.toLowerCase();
    console.log(`[Service Worker] Verificando bloqueio para: ${normalizedDomain}`);
    console.log(`[Service Worker] Domínios bloqueados: ${Array.from(state.blockedDomains.keys()).join(", ")}`);

    // Se o timer global está desativado, nenhum domínio é bloqueado
    if (!state.blockingTimer.enabled) {
        console.log(`[Service Worker] Timer global desativado - ${normalizedDomain} não está bloqueado`);
        return false;
    }

    if (!state.blockedDomains.has(normalizedDomain)) {
        console.log(`[Service Worker] ${normalizedDomain} não está bloqueado`);
        return false;
    }

    console.log(`[Service Worker] ${normalizedDomain} está na lista de bloqueio`);

    // Verifica se há passes disponíveis
    const justification = state.justifications.get(normalizedDomain);
    if (justification && justification.remainingPasses > 0) {
        console.log(`[Service Worker] ${normalizedDomain} tem ${justification.remainingPasses} passes disponíveis`);
        return false; // Não bloqueia se há passes
    }

    console.log(`[Service Worker] ${normalizedDomain} será bloqueado (sem passes)`);
    return true; // Bloqueia
}

/**
 * Inicia a verificação periódica do timer
 */
function startTimerCheck(): void {
    if (state.timerInterval) {
        clearInterval(state.timerInterval);
    }

    state.timerInterval = setInterval(() => {
        if (state.blockingTimer.enabled && state.blockingTimer.startTime) {
            const elapsed = Date.now() - state.blockingTimer.startTime;
            const durationMs = state.blockingTimer.duration * 60 * 1000;

            if (elapsed >= durationMs) {
                state.blockingTimer.enabled = false;
                state.blockingTimer.startTime = null;
                persistState();
                clearInterval(state.timerInterval!);
                state.timerInterval = null;

                // Notifica todas as abas que o timer expirou
                chrome.tabs.query({}, (tabs) => {
                    tabs.forEach((tab) => {
                        if (tab.id) {
                            chrome.tabs.sendMessage(tab.id, {
                                type: "TIMER_EXPIRED",
                            } as any);
                        }
                    });
                });
            }
        }
    }, 5000); // Verifica a cada 5 segundos
}

/**
 * Listeners de mensagens do conteúdo/popup
 */
chrome.runtime.onMessage.addListener((message: ChromeMessage, _sender, sendResponse) => {
    (async () => {
        try {
            switch (message.type) {
                case "UPDATE_DOMAINS": {
                    const { domain, action } = message.payload as {
                        domain: string;
                        action: "add" | "remove";
                    };

                    if (action === "add") {
                        const newDomain: BlockedDomain = {
                            id: `${domain}-${Date.now()}`,
                            domain,
                            addedAt: Date.now(),
                        };
                        state.blockedDomains.set(domain, newDomain);
                    } else if (action === "remove") {
                        state.blockedDomains.delete(domain);
                    }

                    await persistState();
                    sendResponse({ success: true });
                    break;
                }

                case "UPDATE_TIMER": {
                    const timerData = message.payload as BlockingTimer;
                    state.blockingTimer = timerData;

                    if (timerData.enabled) {
                        startTimerCheck();
                    } else if (state.timerInterval) {
                        clearInterval(state.timerInterval);
                        state.timerInterval = null;
                    }

                    await persistState();
                    sendResponse({ success: true });
                    break;
                }

                case "GET_BLOCKING_STATE": {
                    sendResponse({
                        domains: Array.from(state.blockedDomains.values()),
                        timer: state.blockingTimer,
                    });
                    break;
                }

                case "IS_BLOCKED": {
                    const { url } = message.payload as { url: string };
                    const domain = extractDomain(url);
                    const normalizedDomain = domain.toLowerCase();
                    const isBlocked = isDomainBlocked(domain);
                    const justification = state.justifications.get(normalizedDomain);
                    const remainingPasses = justification?.remainingPasses ?? 0;

                    sendResponse({
                        isBlocked,
                        remainingPasses,
                    });
                    break;
                }

                case "SUBMIT_JUSTIFICATION": {
                    const justification = message.payload as BlockingJustification;
                    const normalizedDomain = justification.domain.toLowerCase();
                    console.log("[Service Worker] Justificação recebida:", justification);

                    // Cria uma sessão única para este acesso
                    const sessionId = `session-${Date.now()}-${Math.random()}`;

                    // Salva com 3 passes iniciais
                    state.justifications.set(normalizedDomain, {
                        remainingPasses: 3,
                        sessionId,
                    });

                    console.log(`[Service Worker] Domínio ${normalizedDomain} desbloqueado com 3 passes`);

                    await persistState();
                    sendResponse({ success: true });
                    break;
                }

                case "CHECK_TIMER": {
                    sendResponse({
                        enabled: state.blockingTimer.enabled,
                        remainingTime: calculateRemainingTime(),
                    });
                    break;
                }

                case "USE_PASS": {
                    const { domain } = message.payload as { domain: string };
                    const normalizedDomain = domain.toLowerCase();

                    const justification = state.justifications.get(normalizedDomain);
                    if (justification && justification.remainingPasses > 0) {
                        justification.remainingPasses--;
                        console.log(
                            `[Service Worker] Pass utilizado para ${normalizedDomain}. Passes restantes: ${justification.remainingPasses}`
                        );

                        if (justification.remainingPasses === 0) {
                            state.justifications.delete(normalizedDomain);
                            console.log(
                                `[Service Worker] Passes esgotados para ${normalizedDomain}. Domínio bloqueado novamente.`
                            );
                        }

                        await persistState();
                        sendResponse({ success: true, remainingPasses: justification.remainingPasses });
                    } else {
                        sendResponse({ success: false, remainingPasses: 0 });
                    }
                    break;
                }
                default:
                    sendResponse({ error: "Tipo de mensagem desconhecido" });
            }
        } catch (error) {
            console.error("[Service Worker] Erro ao processar mensagem:", error);
            sendResponse({ error: "Erro ao processar mensagem" });
        }
    })();

    return true; // Keep the message channel open for async response
});

/**
 * Utilitário para extrair domínio de uma URL
 */
function extractDomain(url: string): string {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname.toLowerCase();
    } catch {
        return "";
    }
}

/**
 * Calcula o tempo restante do timer
 */
function calculateRemainingTime(): number {
    if (!state.blockingTimer.enabled || !state.blockingTimer.startTime) {
        return 0;
    }

    const elapsed = Date.now() - state.blockingTimer.startTime;
    const durationMs = state.blockingTimer.duration * 60 * 1000;
    const remaining = Math.max(0, durationMs - elapsed);

    return Math.ceil(remaining / 1000); // Retorna em segundos
}

// Inicializa o estado quando o service worker inicia
initializeState();

// Cleanup ao descarregar
self.addEventListener("unload", () => {
    if (state.timerInterval) {
        clearInterval(state.timerInterval);
    }
});
