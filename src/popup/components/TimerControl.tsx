/**
 * Componente TimerControl
 * Controla o timer global de bloqueio
 */

import React, { useState, useEffect } from "react";
import { BlockingTimer } from "@/types/index";
import clsx from "clsx";

interface TimerControlProps {
    timer: BlockingTimer;
    onUpdate: (timer: BlockingTimer) => Promise<void>;
    loading?: boolean;
}

export const TimerControl: React.FC<TimerControlProps> = ({ timer, onUpdate, loading = false }) => {
    const [duration, setDuration] = useState(timer.duration);
    const [isUpdating, setIsUpdating] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0);

    useEffect(() => {
        if (!timer.enabled || !timer.startTime) {
            setRemainingTime(0);
            return;
        }

        // Calcula o tempo restante
        const updateRemaining = () => {
            const elapsed = Date.now() - timer.startTime!;
            const durationMs = timer.duration * 60 * 1000;
            const remaining = Math.max(0, durationMs - elapsed);
            setRemainingTime(Math.ceil(remaining / 1000));

            if (remaining <= 0) {
                setRemainingTime(0);
            }
        };

        updateRemaining();
        const interval = setInterval(updateRemaining, 1000);

        return () => clearInterval(interval);
    }, [timer.enabled, timer.startTime, timer.duration]);

    const handleToggleTimer = async () => {
        setIsUpdating(true);
        try {
            await onUpdate({
                ...timer,
                enabled: !timer.enabled,
                startTime: !timer.enabled ? Date.now() : null,
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleUpdateDuration = async () => {
        if (duration < 1 || duration > 1440) {
            return;
        }

        setIsUpdating(true);
        try {
            await onUpdate({
                ...timer,
                duration,
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m ${secs}s`;
    };

    return (
        <div className="space-y-4 pt-4 border-t border-gray-200">
            <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Timer Global</h3>

                <div className="space-y-3">
                    {/* Status do Timer */}
                    <div
                        className={clsx(
                            "p-3 rounded-lg border-2 text-center",
                            timer.enabled
                                ? "bg-blue-50 border-primary text-primary"
                                : "bg-gray-50 border-gray-200 text-gray-600"
                        )}
                    >
                        <p className="text-xs font-medium mb-1">Status: {timer.enabled ? "ATIVO" : "INATIVO"}</p>
                        {timer.enabled && remainingTime > 0 && (
                            <p className="text-lg font-bold font-mono">{formatTime(remainingTime)}</p>
                        )}
                    </div>

                    {/* Controle de Duração */}
                    <div className="flex items-center gap-2">
                        <label htmlFor="duration" className="text-sm font-medium text-gray-700 flex-1">
                            Duração (minutos)
                        </label>
                        <input
                            id="duration"
                            type="number"
                            min="1"
                            max="1440"
                            value={duration}
                            onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                            disabled={isUpdating || loading || timer.enabled}
                            className={clsx(
                                "w-20 px-2 py-1.5 border border-gray-300 rounded-lg",
                                "text-sm text-center",
                                "disabled:bg-gray-100 disabled:cursor-not-allowed",
                                "focus:outline-none focus:ring-2 focus:ring-primary"
                            )}
                        />
                        {duration !== timer.duration && (
                            <button
                                onClick={handleUpdateDuration}
                                disabled={isUpdating || loading || timer.enabled}
                                className={clsx(
                                    "px-2 py-1.5 bg-gray-300 text-gray-700 rounded text-xs font-medium",
                                    "hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed",
                                    "transition-colors"
                                )}
                            >
                                Atualizar
                            </button>
                        )}
                    </div>

                    {/* Botão de Ativar/Desativar */}
                    <button
                        onClick={handleToggleTimer}
                        disabled={isUpdating || loading}
                        className={clsx(
                            "w-full py-2.5 rounded-lg font-semibold text-sm transition-all",
                            timer.enabled
                                ? "bg-danger text-white hover:bg-red-600"
                                : "bg-primary text-white hover:bg-blue-600",
                            "disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                    >
                        {isUpdating ? "Atualizando..." : timer.enabled ? "Parar Timer" : "Iniciar Timer"}
                    </button>
                </div>
            </div>
        </div>
    );
};
