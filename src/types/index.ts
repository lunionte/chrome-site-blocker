/**
 * Tipos e interfaces compartilhados entre contextos da extensão
 */

export interface BlockedDomain {
    id: string;
    domain: string;
    addedAt: number;
    reason?: string;
}

export interface BlockingTimer {
    enabled: boolean;
    startTime: number | null;
    duration: number; // em minutos
    justificationRequired: boolean;
}

export interface BlockingState {
    domains: BlockedDomain[];
    timer: BlockingTimer;
    lastUpdated: number;
}

export interface BlockingJustification {
    timestamp: number;
    reason: string;
    domain: string;
    justified: boolean;
}

export interface PuzzleState {
    completed: boolean;
    completionPercentage: number;
}

export interface StorageData {
    blockedDomains: BlockedDomain[];
    blockingTimer: BlockingTimer;
    justifications: BlockingJustification[];
}

export enum MessageType {
    UPDATE_DOMAINS = "UPDATE_DOMAINS",
    UPDATE_TIMER = "UPDATE_TIMER",
    GET_BLOCKING_STATE = "GET_BLOCKING_STATE",
    IS_BLOCKED = "IS_BLOCKED",
    SUBMIT_JUSTIFICATION = "SUBMIT_JUSTIFICATION",
    CHECK_TIMER = "CHECK_TIMER",
    USE_PASS = "USE_PASS",
}

export interface ChromeMessage {
    type: MessageType;
    payload?: unknown;
}

export interface ServiceWorkerState {
    blockedDomains: Map<string, BlockedDomain>;
    blockingTimer: BlockingTimer;
    isTimerActive: boolean;
}
