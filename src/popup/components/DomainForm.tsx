/**
 * Componente DomainForm
 * Formulário para adicionar novos domínios à lista de bloqueio
 */

import React, { useState } from "react";
import clsx from "clsx";

interface DomainFormProps {
    onSubmit: (domain: string) => Promise<void>;
    loading?: boolean;
}

export const DomainForm: React.FC<DomainFormProps> = ({ onSubmit, loading = false }) => {
    const [domain, setDomain] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!domain.trim()) {
            return;
        }

        setIsLoading(true);
        try {
            await onSubmit(domain.trim());
            setDomain("");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3 pb-4 border-b border-gray-200">
            <div>
                <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-1">
                    Adicionar Domínio
                </label>
                <div className="flex gap-2">
                    <input
                        id="domain"
                        type="text"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        placeholder="exemplo.com"
                        disabled={isLoading || loading}
                        className={clsx(
                            "flex-1 px-3 py-2 border border-gray-300 rounded-lg",
                            "text-sm focus:outline-none focus:ring-2 focus:ring-primary",
                            "disabled:bg-gray-100 disabled:cursor-not-allowed",
                            "placeholder-gray-400"
                        )}
                    />
                    <button
                        type="submit"
                        disabled={!domain.trim() || isLoading || loading}
                        className={clsx(
                            "px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm",
                            "hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed",
                            "transition-colors"
                        )}
                    >
                        {isLoading ? "Adicionando..." : "Adicionar"}
                    </button>
                </div>
            </div>
        </form>
    );
};
