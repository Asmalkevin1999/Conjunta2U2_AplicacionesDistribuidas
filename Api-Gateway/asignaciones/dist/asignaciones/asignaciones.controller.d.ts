import { AsignacionesService } from './asignaciones.service';
import { AssignVehicleDto } from './dto/assign-vehicle.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
export declare class AsignacionesController {
    private readonly asignacionesService;
    constructor(asignacionesService: AsignacionesService);
    assignVehicle(assignVehicleDto: AssignVehicleDto): Promise<import("./entities/assignment.entity").Assignment>;
    removeAssignment(userId: string, vehicleId: string): Promise<void>;
    getAssignmentsByUser(userId: string): Promise<Record<string, unknown>[]>;
    updateAssignment(userId: string, vehicleId: string, updateAssignmentDto: UpdateAssignmentDto): Promise<import("./entities/assignment.entity").Assignment>;
}
