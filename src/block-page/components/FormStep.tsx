/**
 * Componente FormStep
 * Segunda etapa - formulário de justificativa
 */

import React, { useState } from "react";
import clsx from "clsx";

interface FormStepProps {
    domain: string;
    onSubmit: (reason: string) => void;
    onBack: () => void;
    loading?: boolean;
    error?: string | null;
    onErrorDismiss?: () => void;
}

export const FormStep: React.FC<FormStepProps> = ({
    domain,
    onSubmit,
    onBack,
    loading = false,
    error = null,
    onErrorDismiss,
}) => {
    const [reason, setReason] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (reason.trim()) {
            onSubmit(reason);
        }
    };

    return (
        <div className="space-y-6">
            {/* Título */}
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">Justificar Acesso</h2>
                <p className="text-sm text-gray-600">Forneça uma justificativa para acessar este domínio</p>
            </div>

            {/* Aviso */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800 font-medium">⚠️ Aviso Importante</p>
                <p className="text-xs text-yellow-700 mt-1">
                    Suas justificativas serão registradas e analisadas. Abusos podem resultar em bloqueios adicionais.
                </p>
            </div>

            {/* Erro */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start justify-between">
                    <p className="text-sm text-red-700">{error}</p>
                    <button onClick={onErrorDismiss} className="text-red-600 hover:text-red-700 text-xs font-medium">
                        ✕
                    </button>
                </div>
            )}

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Domínio Afetado */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Domínio Afetado</label>
                    <div className="bg-gray-100 border border-gray-300 rounded-lg p-3">
                        <p className="font-mono text-sm text-gray-800 break-all">{domain}</p>
                    </div>
                </div>

                {/* Campo de Justificativa */}
                <div>
                    <label htmlFor="reason" className="block text-xs font-medium text-gray-700 mb-2">
                        Sua Justificativa *
                    </label>
                    <textarea
                        id="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Explique por que você precisa acessar este domínio..."
                        disabled={loading}
                        minLength={10}
                        maxLength={500}
                        className={clsx(
                            "w-full px-3 py-2 border border-gray-300 rounded-lg",
                            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                            "disabled:bg-gray-100 disabled:cursor-not-allowed",
                            "text-sm resize-none h-24",
                            "placeholder-gray-400"
                        )}
                    />
                    <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-gray-500">Mínimo 10 caracteres</p>
                        <p className="text-xs text-gray-500">{reason.length}/500</p>
                    </div>
                </div>

                {/* Botões */}
                <div className="space-y-3 pt-4">
                    <button
                        type="submit"
                        disabled={reason.trim().length < 10 || loading}
                        className={clsx(
                            "w-full py-3 bg-primary text-white rounded-lg font-semibold",
                            "hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed",
                            "transition-all"
                        )}
                    >
                        {loading ? "Enviando..." : "Enviar Justificativa"}
                    </button>
                    <button
                        type="button"
                        onClick={onBack}
                        disabled={loading}
                        className={clsx(
                            "w-full py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold",
                            "hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed",
                            "transition-all"
                        )}
                    >
                        Voltar
                    </button>
                </div>
            </form>

            {/* Info */}
            <div className="text-center">
                <p className="text-xs text-gray-500">Seus dados serão mantidos privados</p>
            </div>
        </div>
    );
};
