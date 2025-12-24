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
    // Quando o puzzle é completado, submete com uma justificativa padrão
    const handlePuzzleComplete = () => {
        onSubmit(`Desbloqueio solicitado para ${domain} após confirmação de segurança`);
    };

    return (
        <div className="space-y-6">
            {/* Puzzle Challenge */}
            <PuzzleChallenge domain={domain} onComplete={handlePuzzleComplete} />

            {/* Botão Voltar */}
            <button
                onClick={onBack}
                disabled={loading}
                className="w-full py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                Voltar
            </button>
        </div>
    );
};
