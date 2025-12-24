/**
 * Componente PuzzleChallenge
 * Desafio visual de segurança - Slider de encaixe elegante
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

        if (value >= 95 && !isCompleted) {
            setIsCompleted(true);
            setShowSuccess(true);
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
        <div className="space-y-7">
            {/* Título com hierarquia clara */}
            <div className="flex flex-col items-center space-y-3">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                </div>
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Desafio de Segurança</h2>
                    <p className="text-sm text-gray-600 mt-1">Complete o desafio visual para prosseguir</p>
                </div>
            </div>

            {/* Instruções com info-box */}
            <div className="info-box info-box--primary">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fillRule="evenodd"
                        d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2z"
                        clipRule="evenodd"
                    />
                </svg>
                <div>
                    <p className="font-semibold text-blue-900 text-sm mb-1">Instrução</p>
                    <p className="text-xs text-blue-700 leading-relaxed">
                        Arraste o controle deslizante até o final para confirmar sua intenção de acessar{" "}
                        <code className="bg-blue-100 px-2 py-0.5 rounded text-xs font-mono text-blue-900">
                            {domain}
                        </code>
                    </p>
                </div>
            </div>

            {/* Slider Principal - Design Moderno */}
            <div className="space-y-5">
                {/* Slider Container */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-10 blur transition-opacity duration-300" />

                    <div className="relative bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-1 overflow-hidden shadow-inner">
                        {/* Background de progresso com gradient */}
                        <div
                            className={clsx(
                                "absolute inset-1 rounded-xl transition-all duration-300",
                                isCompleted
                                    ? "bg-gradient-to-r from-emerald-400 to-cyan-400"
                                    : "bg-gradient-to-r from-blue-400 to-cyan-400"
                            )}
                            style={{ width: `calc(${sliderPosition}% - 0.25rem)`, maxWidth: "calc(100% - 0.5rem)" }}
                        />

                        {/* Slider Input com thumbstyle customizado */}
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={sliderPosition}
                            onChange={handleSliderChange}
                            disabled={isCompleted}
                            className={clsx(
                                "relative w-full h-14 appearance-none bg-transparent cursor-pointer z-10",
                                "focus:outline-none",
                                "disabled:cursor-not-allowed",
                                "[&::-webkit-slider-thumb]:appearance-none",
                                "[&::-webkit-slider-thumb]:w-12",
                                "[&::-webkit-slider-thumb]:h-12",
                                "[&::-webkit-slider-thumb]:rounded-xl",
                                "[&::-webkit-slider-thumb]:bg-white",
                                "[&::-webkit-slider-thumb]:shadow-lg",
                                "[&::-webkit-slider-thumb]:cursor-grab",
                                "[&::-webkit-slider-thumb]:active:cursor-grabbing",
                                "[&::-webkit-slider-thumb]:transition-all",
                                "[&::-moz-range-thumb]:w-12",
                                "[&::-moz-range-thumb]:h-12",
                                "[&::-moz-range-thumb]:rounded-xl",
                                "[&::-moz-range-thumb]:bg-white",
                                "[&::-moz-range-thumb]:shadow-lg",
                                "[&::-moz-range-thumb]:border-0",
                                "[&::-moz-range-thumb]:cursor-grab"
                            )}
                        />

                        {/* Texto do Slider */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span
                                className={clsx(
                                    "font-bold text-lg transition-all duration-300 drop-shadow-sm",
                                    isCompleted ? "text-white scale-110" : "text-gray-700"
                                )}
                            >
                                {isCompleted ? "✓ Concluído!" : "Arraste →"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Barra de Progresso Secundária */}
                <div className="space-y-2">
                    <div className="flex items-end justify-between">
                        <p className="text-xs font-semibold text-gray-600">Progresso de Confirmação</p>
                        <p className="text-xs font-bold text-blue-600">{sliderPosition}%</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden shadow-sm">
                        <div
                            className={clsx(
                                "h-full transition-all duration-300 rounded-full",
                                isCompleted
                                    ? "bg-gradient-to-r from-emerald-500 to-cyan-500"
                                    : "bg-gradient-to-r from-blue-500 to-cyan-500"
                            )}
                            style={{ width: `${sliderPosition}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Mensagem de Sucesso - Animada */}
            {showSuccess && (
                <div className="animate-slideInUp">
                    <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 border-2 border-emerald-300 rounded-xl p-4 text-center shadow-lg">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <p className="font-bold text-emerald-900">Desafio Concluído!</p>
                        </div>
                        <p className="text-xs text-emerald-700">Você será redirecionado em breve...</p>
                    </div>
                </div>
            )}

            {/* Aviso de Segurança */}
            <div className="info-box info-box--warning">
                <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                    />
                </svg>
                <p className="text-xs text-amber-800">
                    <span className="font-semibold">Segurança:</span> Este desafio confirma sua intenção de acessar este
                    domínio
                </p>
            </div>

            {/* Botão Reset */}
            {isCompleted && (
                <button
                    onClick={handleReset}
                    className="w-full py-2.5 px-4 bg-gray-100 text-gray-800 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                    🔄 Tentar Novamente
                </button>
            )}
        </div>
    );
};
