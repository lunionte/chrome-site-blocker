/**
 * Componente FormStep
 * Segunda etapa - desafio de segurança com puzzle visual
 */

import React from "react";
import { PuzzleChallenge } from "./PuzzleChallenge";

interface FormStepProps {
    domain: string;
    onSubmit: (reason: string) => void;
    onBack: () => void;
    loading?: boolean;
    error?: string | null;
    onErrorDismiss?: () => void;
}

export const FormStep: React.FC<FormStepProps> = ({ domain, onSubmit, onBack, loading = false }) => {
    const handlePuzzleComplete = () => {
        onSubmit(`Desbloqueio solicitado para ${domain} após confirmação de segurança`);
    };

    return (
        <div className="space-y-6">
            {/* Puzzle Challenge com animação */}
            <div className="animate-slideInUp">
                <PuzzleChallenge domain={domain} onComplete={handlePuzzleComplete} />
            </div>

            {/* Botão Voltar */}
            <button
                onClick={onBack}
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gray-100 text-gray-800 rounded-xl font-semibold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Voltar
            </button>
        </div>
    );
};
