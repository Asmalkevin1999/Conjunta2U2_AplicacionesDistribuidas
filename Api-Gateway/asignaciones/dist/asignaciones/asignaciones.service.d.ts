import { Repository } from 'typeorm';
import { Assignment } from './entities/assignment.entity';
import { AssignmentHistory } from './entities/assignment-history.entity';
import { AssignVehicleDto } from './dto/assign-vehicle.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { HttpService } from '@nestjs/axios';
export declare class AsignacionesService {
    private readonly assignmentRepository;
    private readonly historyRepository;
    private readonly httpService;
    private readonly httpClient;
    constructor(assignmentRepository: Repository<Assignment>, historyRepository: Repository<AssignmentHistory>, httpService: HttpService);
    private recordHistory;
    assignVehicle(assignVehicleDto: AssignVehicleDto): Promise<Assignment>;
    removeAssignment(userId: string, vehicleId: string): Promise<void>;
    findAssignmentsByUser(userId: string): Promise<Array<Record<string, unknown>>>;
    private fetchVehicle;
    updateAssignment(userId: string, vehicleId: string, updateAssignmentDto: UpdateAssignmentDto): Promise<Assignment>;
}
