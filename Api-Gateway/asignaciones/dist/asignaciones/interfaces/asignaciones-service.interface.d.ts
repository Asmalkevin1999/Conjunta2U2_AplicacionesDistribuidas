import { AssignVehicleDto } from '../dto/assign-vehicle.dto';
import { UpdateAssignmentDto } from '../dto/update-assignment.dto';
import { Assignment } from '../entities/assignment.entity';
export interface IAsignacionesService {
    assignVehicle(assignVehicleDto: AssignVehicleDto): Promise<Assignment>;
    removeAssignment(userId: string, vehicleId: string): Promise<void>;
    findAssignmentsByUser(userId: string): Promise<Array<Record<string, unknown>>>;
    updateAssignment(userId: string, vehicleId: string, updateAssignmentDto: UpdateAssignmentDto): Promise<Assignment>;
}
