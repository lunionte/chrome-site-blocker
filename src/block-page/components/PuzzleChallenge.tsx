/**
 * Componente PuzzleChallenge
 * Desafio visual de segurança - Slider de encaixe
 */

import React, { useState } from "react";
import clsx from "clsx";

interface PuzzleChallengeProps {
    onComplete: () => void;
    domain: string;
}

export const PuzzleChallenge: React.FC<PuzzleChallengeProps> = ({ onComplete, domain }) => {
    const [sliderPosition, setSliderPosition] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        setSliderPosition(value);

        // Desafio completado quando o slider atinge 100
        if (value >= 95 && !isCompleted) {
            setIsCompleted(true);
            setShowSuccess(true);
            // Espera um pouco para mostrar a animação de sucesso
            setTimeout(() => {
                onComplete();
            }, 1500);
        }
    };

    const handleReset = () => {
        setSliderPosition(0);
        setIsCompleted(false);
        setShowSuccess(false);
    };

    return (
        <div className="space-y-6">
            {/* Título */}
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">Desafio de Segurança</h2>
                <p className="text-sm text-gray-600">Complete o desafio visual para prosseguir</p>
            </div>

            {/* Instruções */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <p className="text-sm text-blue-900 font-medium">📌 Instruções</p>
                <p className="text-xs text-blue-700 mt-2">
                    Arraste o controle deslizante até o final para confirmar sua intenção de acessar{" "}
                    <code className="bg-blue-100 px-2 py-1 rounded text-xs">{domain}</code>
                </p>
            </div>

            {/* Puzzle Slider */}
            <div className="space-y-4 text-center">
                <div className="relative bg-gray-100 rounded-full p-1 overflow-hidden shadow-md">
                    {/* Background de progresso */}
                    <div
                        className={clsx(
                            "absolute left-0 top-0 h-full rounded-full transition-all duration-300",
                            isCompleted ? "bg-green-500" : "bg-blue-400"
                        )}
                        style={{ width: `${sliderPosition}%` }}
                    />

                    {/* Slider Input */}
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={sliderPosition}
                        onChange={handleSliderChange}
                        disabled={isCompleted}
                        className={clsx(
                            "relative w-full h-12 appearance-none bg-transparent cursor-pointer z-10",
                            "focus:outline-none",
                            "disabled:cursor-not-allowed"
                        )}
                        style={{
                            WebkitAppearance: "slider-horizontal",
                        }}
                    />

                    {/* Texto do Slider */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span
                            className={clsx(
                                "text-sm font-semibold transition-colors duration-300",
                                isCompleted ? "text-white" : "text-gray-700"
                            )}
                        >
                            {isCompleted ? "✓ Concluído!" : "Arraste →"}
                        </span>
                    </div>
                </div>

                {/* Mensagem de Progresso */}
                <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div
                            className={clsx(
                                "h-full transition-all duration-300",
                                isCompleted ? "bg-green-500" : "bg-blue-500"
                            )}
                            style={{ width: `${sliderPosition}%` }}
                        />
                    </div>
                    <p className="text-xs text-gray-600">
                        Progresso: <strong>{sliderPosition}%</strong>
                    </p>
                </div>
            </div>

            {/* Mensagem de Sucesso */}
            {showSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center animate-pulse">
                    <p className="text-sm text-green-900 font-semibold">✓ Desafio Concluído!</p>
                    <p className="text-xs text-green-700 mt-1">Você será redirecionado em breve...</p>
                </div>
            )}

            {/* Aviso de Segurança */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <p className="text-xs text-yellow-800">
                    ⚠️ Este desafio confirma sua intenção de acessar este domínio bloqueado
                </p>
            </div>

            {/* Botão Reset */}
            {isCompleted && (
                <button
                    onClick={handleReset}
                    className={clsx(
                        "w-full py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold text-sm",
                        "hover:bg-gray-300 transition-all"
                    )}
                >
                    Tentar Novamente
                </button>
            )}
        </div>
    );
};
