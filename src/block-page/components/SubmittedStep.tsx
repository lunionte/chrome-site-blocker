/**
 * Componente SubmittedStep
 * Quarta etapa - confirmação de envio com design celebrativo
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
        <div className="flex flex-col items-center space-y-8">
            {/* Ícone de Sucesso - Animado */}
            <div className="animate-scaleIn">
                <div className="relative w-24 h-24">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-cyan-100 to-green-100 rounded-full animate-pulseGlow" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                            className="w-12 h-12 text-green-600 animate-slideHorizontal"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Mensagem Principal */}
            <div className="text-center space-y-3 animate-slideInUp">
                <h2 className="text-3xl font-bold text-gray-900">Justificativa Enviada!</h2>
                <p className="text-base text-gray-600 leading-relaxed">
                    Sua justificativa foi <span className="font-semibold text-green-600">registrada com sucesso</span>
                </p>
                <div className="pt-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-gray-600 font-medium">
                        <span className="opacity-75">Acessando:</span>{" "}
                        <code className="bg-blue-100 px-2 py-1 rounded text-xs font-mono text-blue-900">{domain}</code>
                    </p>
                </div>
            </div>

            {/* Info de Redirecionamento */}
            <div className="info-box info-box--success w-full">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                    />
                </svg>
                <div>
                    <p className="font-semibold text-green-900 text-sm mb-1">✓ Redirecionando...</p>
                    <p className="text-xs text-green-700">
                        Você será redirecionado em <span className="font-bold text-lg text-green-900">{countdown}</span>{" "}
                        segundo{countdown !== 1 ? "s" : ""}
                    </p>
                </div>
            </div>

            {/* Status Final */}
            <div className="text-center animate-fadeIn">
                <p className="text-xs text-gray-500">Se não for redirecionado automaticamente, feche esta aba</p>
            </div>

            {/* Confete Visual (CSS) */}
            <div className="fixed inset-0 pointer-events-none">
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full animate-slideInUp"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: "50%",
                            animation: `slideInUp ${2 + Math.random() * 1}s ease-out forwards`,
                            delay: `${i * 0.1}s`,
                            opacity: 0.6,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};
