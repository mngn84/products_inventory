export interface HistoryFilters {
    shop_id?: number;
    plu?: number;
    start_date?: Date;
    end_date?: Date;
    action?: string;
    limit?: number;
    offset?: number;
}

export interface HistoryEvent {
    type: string;
    payload: EventPayload;
}

interface EventPayload {
    plu?: number;
    shop_id?: number;
}