/**
 * Componente WarningStep
 * Primeira etapa - aviso de site bloqueado
 */

import React from "react";
import clsx from "clsx";

interface WarningStepProps {
    domain: string;
    onProceed: () => void;
    onCancel: () => void;
    loading?: boolean;
}

export const WarningStep: React.FC<WarningStepProps> = ({ domain, onProceed, onCancel, loading = false }) => {
    return (
        <div className="space-y-6">
            {/* Ícone e Título */}
            <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4v2m0 0a9 9 0 0 1-9-9 9 9 0 0 1 18 0 9 9 0 0 1-9 9z"
                        />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Site Bloqueado</h2>
                <p className="text-sm text-gray-600">
                    Você está tentando acessar um domínio que está na lista de bloqueio
                </p>
            </div>

            {/* Domínio Bloqueado */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-xs font-medium text-red-700 uppercase tracking-wide mb-2">Domínio Bloqueado</p>
                <p className="font-mono text-lg text-red-900 break-all">{domain}</p>
            </div>

            {/* Mensagem Educativa */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                <p className="text-sm text-blue-900 font-medium">💡 Este bloqueio foi configurado para sua segurança</p>
                <p className="text-xs text-blue-700">
                    Se acredita que é uma ação equivocada, você pode fornecer uma justificativa para prosseguir.
                </p>
            </div>

            {/* Limite de Acessos */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2 text-center">
                <p className="text-sm text-green-900 font-semibold">🔓 Limite de Acessos</p>
                <p className="text-xs text-green-800">
                    Ao desbloquear este domínio, você receberá um limite adicional de <strong>até 3 acessos</strong>{" "}
                    dentro dessa sessão.
                </p>
            </div>

            {/* Botões de Ação */}
            <div className="space-y-3">
                <button
                    onClick={onProceed}
                    disabled={loading}
                    className={clsx(
                        "w-full py-3 bg-primary text-white rounded-lg font-semibold",
                        "hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed",
                        "transition-all"
                    )}
                >
                    {loading ? "Processando..." : "Desejo Prosseguir"}
                </button>
                <button
                    onClick={onCancel}
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

            {/* Dica de Segurança */}
            <div className="text-center">
                <p className="text-xs text-gray-500 italic">
                    Este bloqueio está rastreando todas as tentativas de acesso
                </p>
            </div>
        </div>
    );
};
