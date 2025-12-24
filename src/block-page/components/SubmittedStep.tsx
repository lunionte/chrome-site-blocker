/**
 * Componente SubmittedStep
 * Quarta etapa - confirmação de envio
 */

import React, { useEffect, useState } from "react";

interface SubmittedStepProps {
    domain: string;
}

export const SubmittedStep: React.FC<SubmittedStepProps> = ({ domain }) => {
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="space-y-6 text-center">
            {/* Ícone de Sucesso */}
            <div>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                        className="w-10 h-10 text-green-600 animate-bounce"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            </div>

            {/* Mensagem */}
            <div className="space-y-3">
                <h2 className="text-2xl font-bold text-gray-900">Justificativa Enviada!</h2>
                <p className="text-sm text-gray-600">Sua justificativa foi registrada com sucesso</p>
                <p className="text-xs text-gray-500">
                    <strong>Domínio:</strong> {domain}
                </p>
            </div>

            {/* Info */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
                <p className="text-sm text-green-900 font-medium">✓ Redirecionando...</p>
                <p className="text-xs text-green-700">
                    Você será redirecionado em <strong>{countdown}</strong> segundo{countdown !== 1 ? "s" : ""}
                </p>
            </div>

            {/* Status */}
            <div className="text-center">
                <p className="text-xs text-gray-500 italic">
                    Se não for redirecionado automaticamente, feche esta abra
                </p>
            </div>
        </div>
    );
};
