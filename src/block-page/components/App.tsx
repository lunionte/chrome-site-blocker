/**
 * Componente App principal da página de bloqueio
 */

import React, { useEffect } from "react";
import { useBlockPageStore } from "../store";
import { WarningStep } from "./WarningStep";
import { FormStep } from "./FormStep";
import { ConfirmationStep } from "./ConfirmationStep";
import { SubmittedStep } from "./SubmittedStep";

export const BlockPageApp: React.FC = () => {
    const {
        step,
        domain,
        targetUrl,
        reason,
        loading,
        error,
        setStep,
        setReason,
        submitJustification,
        goBack,
        clearError,
    } = useBlockPageStore();

    // Extrai parâmetros da URL ao carregar
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const targetParam = params.get("target");
        const domainParam = params.get("domain");

        if (domainParam) {
            useBlockPageStore.setState({ domain: decodeURIComponent(domainParam) });
        }

        if (targetParam) {
            useBlockPageStore.setState({ targetUrl: decodeURIComponent(targetParam) });
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 lg:p-8">
            {/* Background decorativo */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-80 h-80 bg-blue-500 opacity-10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-500 opacity-10 rounded-full blur-3xl" />
            </div>

            {/* Container principal */}
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-scaleIn">
                {/* Header com gradiente sofisticado */}
                <div className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 px-8 py-10 text-white overflow-hidden">
                    {/* Efeito de fundo */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-2xl" />
                    </div>

                    {/* Conteúdo do header */}
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold mb-1">🔒 Site Bloqueado</h1>
                        <p className="text-blue-100 text-sm font-medium">X-Chrome Site Blocker</p>
                    </div>
                </div>

                {/* Conteúdo principal com animação */}
                <div className="p-8 lg:p-10 min-h-[400px] animate-fadeIn">
                    {step === "warning" && (
                        <div className="animate-slideInUp">
                            <WarningStep
                                domain={domain}
                                onProceed={() => setStep("form")}
                                onCancel={goBack}
                                loading={loading}
                            />
                        </div>
                    )}

                    {step === "form" && (
                        <div className="animate-slideInUp">
                            <FormStep
                                domain={domain}
                                onSubmit={(newReason) => {
                                    setReason(newReason);
                                    setStep("confirmation");
                                }}
                                onBack={() => setStep("warning")}
                                loading={loading}
                                error={error}
                                onErrorDismiss={clearError}
                            />
                        </div>
                    )}

                    {step === "confirmation" && (
                        <div className="animate-slideInUp">
                            <ConfirmationStep
                                domain={domain}
                                reason={reason}
                                onConfirm={submitJustification}
                                onEdit={() => setStep("form")}
                                loading={loading}
                            />
                        </div>
                    )}

                    {step === "submitted" && (
                        <div className="animate-scaleIn">
                            <SubmittedStep domain={domain} />
                        </div>
                    )}
                </div>

                {/* Footer com indicador de progresso */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-semibold text-gray-700">
                            {step === "warning" && "Etapa 1 de 3"}
                            {step === "form" && "Etapa 2 de 3"}
                            {step === "confirmation" && "Etapa 3 de 3"}
                            {step === "submitted" && "✓ Concluído"}
                        </p>
                        <div className="flex gap-1.5">
                            {["warning", "form", "confirmation"].map((s) => (
                                <div
                                    key={s}
                                    className={`h-1.5 w-6 rounded-full transition-all duration-300 ${
                                        ["warning", "form", "confirmation"].indexOf(step) >=
                                        ["warning", "form", "confirmation"].indexOf(s)
                                            ? "bg-blue-500"
                                            : "bg-gray-300"
                                    }`}
                                />
                            ))}
                            {step === "submitted" && <div className="h-1.5 w-6 rounded-full bg-green-500" />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
