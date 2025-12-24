/**
 * Componente ConfirmationStep
 * Terceira etapa - confirmação antes de enviar
 */

import React from "react";
import clsx from "clsx";

interface ConfirmationStepProps {
    domain: string;
    reason: string;
    onConfirm: () => void;
    onEdit: () => void;
    loading?: boolean;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
    domain,
    reason,
    onConfirm,
    onEdit,
    loading = false,
}) => {
    return (
        <div className="space-y-6 text-center">
            {/* Título */}
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900 text-center">Confirme Seus Dados</h2>
                <p className="text-sm text-gray-600 text-center">Revise as informações antes de enviar</p>
            </div>

            {/* Resumo */}
            <div className="space-y-4">
                {/* Domínio */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-xs font-medium text-gray-600 uppercase mb-2">Domínio</p>
                    <p className="font-mono text-sm text-gray-900 break-all">{domain}</p>
                </div>

                {/* Justificativa */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-xs font-medium text-gray-600 uppercase mb-2">Sua Justificativa</p>
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{reason}</p>
                    <p className="text-xs text-gray-500 mt-2">{reason.length} caracteres</p>
                </div>

                {/* Termos */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2 text-center">
                    <p className="text-sm text-blue-900 font-medium text-center">✓ Ao prosseguir, você concorda:</p>
                    <ul className="text-xs text-blue-800 space-y-1 inline-block">
                        <li>• Que esta justificativa é verdadeira e completa</li>
                        <li>• Que você está ciente que abusos podem resultar em bloqueios adicionais</li>
                        <li>• Que suas informações serão registradas para análise</li>
                    </ul>
                </div>
            </div>

            {/* Botões */}
            <div className="space-y-3">
                <button
                    onClick={onConfirm}
                    disabled={loading}
                    className={clsx(
                        "w-full py-3 bg-primary text-white rounded-lg font-semibold",
                        "hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed",
                        "transition-all"
                    )}
                >
                    {loading ? "Enviando..." : "Confirmar e Enviar"}
                </button>
                <button
                    onClick={onEdit}
                    disabled={loading}
                    className={clsx(
                        "w-full py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold",
                        "hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed",
                        "transition-all"
                    )}
                >
                    Editar Justificativa
                </button>
            </div>
        </div>
    );
};
