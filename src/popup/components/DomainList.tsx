/**
 * Componente DomainList
 * Lista domínios bloqueados com ações de remover
 */

import React from "react";
import { BlockedDomain } from "@/types/index";
import clsx from "clsx";

interface DomainListProps {
    domains: BlockedDomain[];
    onRemove: (domain: string) => void;
    loading?: boolean;
}

export const DomainList: React.FC<DomainListProps> = ({ domains, onRemove, loading = false }) => {
    if (domains.length === 0) {
        return (
            <div className="py-8 text-center">
                <p className="text-gray-500 text-sm">Nenhum domínio bloqueado</p>
                <p className="text-gray-400 text-xs mt-1">Adicione domínios usando o formulário acima</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Domínios Bloqueados ({domains.length})</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
                {domains.map((domain) => (
                    <div
                        key={domain.id}
                        className={clsx(
                            "flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200",
                            "hover:bg-gray-100 transition-colors"
                        )}
                    >
                        <div className="flex-1 min-w-0">
                            <p className="font-mono text-sm text-gray-800 truncate">{domain.domain}</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {new Date(domain.addedAt).toLocaleDateString("pt-BR")}
                            </p>
                        </div>
                        <button
                            onClick={() => onRemove(domain.domain)}
                            disabled={loading}
                            className={clsx(
                                "ml-3 px-3 py-1.5 text-xs font-medium rounded-md",
                                "bg-danger text-white hover:bg-red-600",
                                "disabled:opacity-50 disabled:cursor-not-allowed",
                                "transition-colors"
                            )}
                        >
                            Remover
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
