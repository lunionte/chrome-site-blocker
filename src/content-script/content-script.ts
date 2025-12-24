/**
 * Content Script
 * Intercepta navegações e redireciona para a página de bloqueio
 */

import type { ChromeMessage } from "@/types/index";

// Flag para evitar redirecionamentos recursivos
let isRedirecting = false;

/**
 * Verifica se o domínio atual está bloqueado
 */
async function checkIfBlocked(): Promise<{ isBlocked: boolean; remainingPasses: number }> {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage(
            {
                type: "IS_BLOCKED",
                payload: { url: window.location.href },
            } as ChromeMessage,
            (response) => {
                resolve({
                    isBlocked: response?.isBlocked ?? true,
                    remainingPasses: response?.remainingPasses ?? 0,
                });
            }
        );
    });
}

/**
 * Redireciona para a página de bloqueio
 */
function redirectToBlockPage(): void {
    if (isRedirecting) return;

    isRedirecting = true;

    const blockPageUrl = chrome.runtime.getURL("block-page.html");
    const targetUrl = encodeURIComponent(window.location.href);
    const domain = encodeURIComponent(new URL(window.location.href).hostname);

    window.location.href = `${blockPageUrl}?target=${targetUrl}&domain=${domain}`;
}

/**
 * Verifica bloqueio ao carregar a página
 */
async function performInitialCheck(): Promise<void> {
    if (window.self !== window.top) {
        // Não verifica em iframes
        return;
    }

    // Aguarda o DOM estar pronto
    if (document.readyState === "loading") {
        await new Promise((resolve) => {
            document.addEventListener("DOMContentLoaded", resolve, { once: true });
        });
    }

    const blockStatus = await checkIfBlocked();

    if (blockStatus.isBlocked) {
        // Pequeno delay para garantir que o documento está pronto
        setTimeout(() => {
            redirectToBlockPage();
        }, 500);
    } else if (blockStatus.remainingPasses > 0) {
        // Usa um pass automaticamente se houver
        const domain = new URL(window.location.href).hostname;
        chrome.runtime.sendMessage({
            type: "USE_PASS",
            payload: { domain },
        } as any);
    }
}

// Inicia a verificação quando o documento começa a carregar
if (document.readyState === "loading") {
    performInitialCheck();
} else {
    // Se o documento já está pronto, verifica imediatamente
    performInitialCheck();
}

// Listener para mensagens do background
chrome.runtime.onMessage.addListener((message: any) => {
    if (message.type === "TIMER_EXPIRED") {
        console.log("[Content Script] Timer expirado, atualizando status");
        // Pode ser usado para atualizar UI se necessário
    }
});

// Log para debug
console.log("[Content Script] Carregado em:", window.location.href);
