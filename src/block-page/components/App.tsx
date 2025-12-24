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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-lg shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-8 text-white">
                    <h1 className="text-2xl font-bold">Site Bloqueado</h1>
                    <p className="text-red-100 text-sm mt-1">X-Chrome Site Blocker</p>
                </div>

                {/* Conteúdo */}
                <div className="p-8">
                    {step === "warning" && (
                        <WarningStep
                            domain={domain}
                            onProceed={() => setStep("form")}
                            onCancel={goBack}
                            loading={loading}
                        />
                    )}

                    {step === "form" && (
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
                    )}

                    {step === "confirmation" && (
                        <ConfirmationStep
                            domain={domain}
                            reason={reason}
                            onConfirm={submitJustification}
                            onEdit={() => setStep("form")}
                            loading={loading}
                        />
                    )}

                    {step === "submitted" && <SubmittedStep domain={domain} />}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 text-center">
                    <p className="text-xs text-gray-500">
                        {step === "warning" && "Etapa 1 de 3"}
                        {step === "form" && "Etapa 2 de 3"}
                        {step === "confirmation" && "Etapa 3 de 3"}
                        {step === "submitted" && "Concluído"}
                    </p>
                </div>
            </div>
        </div>
    );
};
