export declare enum ActionType {
    CREACION = "CREACION",
    MODIFICACION = "MODIFICACION",
    ELIMINACION = "ELIMINACION"
}
export declare class AssignmentHistory {
    id: string;
    userId: string;
    vehicleId: string;
    action: ActionType;
    timestamp: Date;
    previousState: Record<string, unknown> | null;
    newState: Record<string, unknown> | null;
}
