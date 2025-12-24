/**
 * Componente ConfirmationStep
 * Terceira etapa - confirmação antes de enviar com design moderno
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
        <div className="space-y-7">
            {/* Título e Subtítulo */}
            <div className="flex flex-col items-center space-y-3">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                        </svg>
                    </div>
                </div>
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Confirme Seus Dados</h2>
                    <p className="text-sm text-gray-600 mt-1">Revise as informações antes de enviar</p>
                </div>
            </div>

            {/* Resumo de Cards */}
            <div className="space-y-4">
                {/* Domínio */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
                    <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4 group-hover:border-gray-300 transition-all duration-300">
                        <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2 opacity-75">
                            📍 Domínio
                        </p>
                        <p className="font-mono text-base text-gray-900 break-all font-semibold">{domain}</p>
                    </div>
                </div>

                {/* Justificativa */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
                    <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4 group-hover:border-gray-300 transition-all duration-300">
                        <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2 opacity-75">
                            📝 Justificativa
                        </p>
                        <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap line-clamp-3">
                            {reason}
                        </p>
                        <p className="text-xs text-gray-500 mt-3 font-semibold">{reason.length} caracteres</p>
                    </div>
                </div>

                {/* Termos - Info Box */}
                <div className="info-box info-box--primary">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v2h8v-2zM2 15a4 4 0 008 0v2H2v-2z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <div>
                        <p className="font-semibold text-blue-900 text-sm mb-2">✓ Ao prosseguir, você concorda:</p>
                        <ul className="text-xs text-blue-800 space-y-1.5">
                            <li className="flex gap-2">
                                <span className="font-bold mt-1">•</span>
                                <span>Que esta justificativa é verdadeira e completa</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="font-bold mt-1">•</span>
                                <span>Que abusos podem resultar em bloqueios adicionais permanentes</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="font-bold mt-1">•</span>
                                <span>Que suas informações serão registradas para análise</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Botões de Ação */}
            <div className="space-y-3 pt-4">
                <button
                    onClick={onConfirm}
                    disabled={loading}
                    className={clsx(
                        "w-full py-3.5 px-4 rounded-xl font-semibold text-white transition-all duration-300",
                        "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "shadow-md hover:shadow-lg active:shadow-sm",
                        "flex items-center justify-center gap-2"
                    )}
                >
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Enviando...</span>
                        </>
                    ) : (
                        <>
                            <span>✓ Confirmar e Enviar</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                />
                            </svg>
                        </>
                    )}
                </button>

                <button
                    onClick={onEdit}
                    disabled={loading}
                    className={clsx(
                        "w-full py-3.5 px-4 rounded-xl font-semibold transition-all duration-300",
                        "bg-gray-100 text-gray-800 hover:bg-gray-200",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "shadow-sm hover:shadow-md",
                        "flex items-center justify-center gap-2"
                    )}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                    </svg>
                    Editar Justificativa
                </button>
            </div>
        </div>
    );
};
