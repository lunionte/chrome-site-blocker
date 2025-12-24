/**
 * Componente ErrorAlert
 * Exibe mensagens de erro
 */

import React from "react";
import clsx from "clsx";

interface ErrorAlertProps {
    message: string | null;
    onDismiss: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onDismiss }) => {
    if (!message) return null;

    return (
        <div
            className={clsx(
                "p-3 bg-red-50 border border-red-200 rounded-lg",
                "flex items-start justify-between gap-3",
                "animate-slide-up"
            )}
        >
            <p className="text-sm text-red-700">{message}</p>
            <button onClick={onDismiss} className="text-red-600 hover:text-red-700 font-medium text-xs">
                Fechar
            </button>
        </div>
    );
};
