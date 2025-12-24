/**
 * Componente WarningStep
 * Primeira etapa - aviso de site bloqueado com design moderno
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
            <div className="flex flex-col items-center space-y-4">
                {/* Ícone Animado */}
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4v2m0 4v2m6-4a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Títulos */}
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold text-gray-900">Site Bloqueado</h2>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Você está tentando acessar um domínio que está na lista de bloqueio
                    </p>
                </div>
            </div>

            {/* Domínio Bloqueado - Card com gradient */}
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                <div className="relative bg-red-50 border border-red-200 rounded-xl p-5 transition-all duration-300">
                    <p className="text-xs font-semibold text-red-700 uppercase tracking-widest mb-3 opacity-75">
                        🚫 Domínio Bloqueado
                    </p>
                    <p className="font-mono text-lg text-red-900 break-all font-semibold">{domain}</p>
                </div>
            </div>

            {/* Mensagem de Segurança */}
            <div className="info-box info-box--primary animate-slideInUp">
                <div className="flex-1">
                    <p className="text-sm text-blue-900 font-semibold mb-1">💡 Configurado para sua segurança</p>
                    <p className="text-xs text-blue-700 leading-relaxed">
                        Se acredita que é uma ação equivocada, você pode fornecer uma justificativa para prosseguir.
                    </p>
                </div>
            </div>

            {/* Limite de Acessos - Destaque */}
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                <div className="relative bg-gradient-to-br from-emerald-50 to-cyan-50 border-2 border-emerald-200 rounded-xl p-5 transition-all duration-300 group-hover:border-emerald-300 group-hover:shadow-lg">
                    <p className="text-sm text-emerald-900 font-bold mb-2 flex items-center gap-2">
                        🔑 Limite de Acessos
                    </p>
                    <p className="text-sm text-emerald-800 leading-relaxed">
                        Ao desbloquear este domínio, você receberá um limite adicional de{" "}
                        <span className="font-bold text-emerald-900">até 3 acessos</span> dentro dessa sessão.
                    </p>
                </div>
            </div>

            {/* Botões de Ação - Layout Melhorado */}
            <div className="space-y-3 pt-4">
                <button
                    onClick={onProceed}
                    disabled={loading}
                    className={clsx(
                        "w-full py-3.5 px-4 rounded-xl font-semibold text-white transition-all duration-300",
                        "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "shadow-md hover:shadow-lg active:shadow-sm",
                        "flex items-center justify-center gap-2"
                    )}
                >
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Processando...</span>
                        </>
                    ) : (
                        <>
                            <span>Desejo Prosseguir</span>
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
                    onClick={onCancel}
                    disabled={loading}
                    className={clsx(
                        "w-full py-3.5 px-4 rounded-xl font-semibold transition-all duration-300",
                        "bg-gray-100 text-gray-800 hover:bg-gray-200",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "shadow-sm hover:shadow-md active:shadow-none"
                    )}
                >
                    ← Voltar
                </button>
            </div>

            {/* Dica de Segurança */}
            <div className="text-center pt-2">
                <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Todas as tentativas de acesso são registradas
                </p>
            </div>
        </div>
    );
};
