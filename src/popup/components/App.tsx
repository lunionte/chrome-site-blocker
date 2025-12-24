/**
 * Componente App principal do Popup
 */

import React, { useEffect } from "react";
import { usePopupStore } from "../store";
import { DomainForm } from "./DomainForm";
import { DomainList } from "./DomainList";
import { TimerControl } from "./TimerControl";
import { ErrorAlert } from "./ErrorAlert";

export const PopupApp: React.FC = () => {
    const { domains, timer, loading, error, loadState, addDomain, removeDomain, updateTimer, clearError } =
        usePopupStore();

    useEffect(() => {
        loadState();
    }, [loadState]);

    return (
        <div className="w-96 bg-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-4 text-white">
                <h1 className="text-lg font-bold">X-Chrome Site Blocker</h1>
                <p className="text-blue-100 text-xs mt-0.5">Gerencie seus domínios bloqueados</p>
            </div>

            {/* Conteúdo */}
            <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
                {/* Alert de Erro */}
                {error && <ErrorAlert message={error} onDismiss={clearError} />}

                {/* Formulário para Adicionar Domínio */}
                <DomainForm onSubmit={addDomain} loading={loading} />

                {/* Lista de Domínios */}
                {loading && domains.length === 0 ? (
                    <div className="py-8 text-center">
                        <div className="w-6 h-6 border-3 border-blue-200 border-t-primary rounded-full animate-spin mx-auto"></div>
                        <p className="text-sm text-gray-600 mt-2">Carregando...</p>
                    </div>
                ) : (
                    <DomainList domains={domains} onRemove={removeDomain} loading={loading} />
                )}

                {/* Controle de Timer */}
                <TimerControl timer={timer} onUpdate={updateTimer} loading={loading} />
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-center">
                <p className="text-xs text-gray-500">v1.0.0</p>
            </div>
        </div>
    );
};
