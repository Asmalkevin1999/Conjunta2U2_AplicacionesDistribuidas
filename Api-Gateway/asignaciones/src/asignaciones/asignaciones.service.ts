import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from './entities/assignment.entity';
import { AssignmentHistory, ActionType } from './entities/assignment-history.entity';
import { AssignVehicleDto } from './dto/assign-vehicle.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { AxiosInstance } from 'axios';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AsignacionesService {
  private readonly httpClient: AxiosInstance;

  constructor(
    @InjectRepository(Assignment)
    private readonly assignmentRepository: Repository<Assignment>,
    @InjectRepository(AssignmentHistory)
    private readonly historyRepository: Repository<AssignmentHistory>,
    private readonly httpService: HttpService,
  ) {
    this.httpClient = this.httpService.axiosRef;
  }

  private async recordHistory(
    userId: string,
    vehicleId: string,
    action: ActionType,
    previousState: Record<string, unknown> | null,
    newState: Record<string, unknown> | null,
  ) {
    const history = new AssignmentHistory();
    history.userId = userId;
    history.vehicleId = vehicleId;
    history.action = action;
    history.previousState = previousState ?? null;
    history.newState = newState ?? null;

    await this.historyRepository.save(history);
  }

  async assignVehicle(assignVehicleDto: AssignVehicleDto): Promise<Assignment> {
    const existing = await this.assignmentRepository.findOne({
      where: {
        vehicleId: assignVehicleDto.vehicleId,
        active: true,
      },
    });

    if (existing && existing.userId !== assignVehicleDto.userId) {
      throw new ConflictException('El vehículo ya está asignado a otro propietario activo');
    }

    const assignment = await this.assignmentRepository.findOne({
      where: {
        userId: assignVehicleDto.userId,
        vehicleId: assignVehicleDto.vehicleId,
      },
    });

    if (assignment) {
      const previousState = { ...assignment };
      assignment.active = true;
      const updated = await this.assignmentRepository.save(assignment);
      await this.recordHistory(
        assignVehicleDto.userId,
        assignVehicleDto.vehicleId,
        ActionType.MODIFICACION,
        previousState,
        { ...updated },
      );
      return updated;
    }

    const newAssignment = this.assignmentRepository.create({
      userId: assignVehicleDto.userId,
      vehicleId: assignVehicleDto.vehicleId,
      active: true,
    });

    const saved = await this.assignmentRepository.save(newAssignment);
    await this.recordHistory(assignVehicleDto.userId, assignVehicleDto.vehicleId, ActionType.CREACION, null, {
      ...saved,
    });

    return saved;
  }

  async removeAssignment(userId: string, vehicleId: string): Promise<void> {
    const assignment = await this.assignmentRepository.findOne({
      where: { userId, vehicleId, active: true },
    });
    if (!assignment) {
      throw new NotFoundException('Asignación no encontrada');
    }

    const previousState = { ...assignment };
    assignment.active = false;
    const updated = await this.assignmentRepository.save(assignment);
    await this.recordHistory(userId, vehicleId, ActionType.ELIMINACION, previousState, { ...updated });
  }

  async findAssignmentsByUser(userId: string): Promise<Array<Record<string, unknown>>> {
    const assignments = await this.assignmentRepository.find({
      where: { userId, active: true },
    });

    const results = await Promise.all(
      assignments.map(async (assignment) => {
        const vehicle = await this.fetchVehicle(assignment.vehicleId);
        return {
          userId: assignment.userId,
          vehicleId: assignment.vehicleId,
          active: assignment.active,
          assignedAt: assignment.createdAt,
          vehicle,
        };
      }),
    );

    return results;
  }

  private async fetchVehicle(vehicleId: string): Promise<Record<string, unknown>> {
    const vehiculosHost = process.env.VEHICULOS_HOST || 'http://vehiculos:3001';
    const url = `${vehiculosHost}/vehiculos/${vehicleId}`;

    try {
      const response = await firstValueFrom(this.httpService.get(url));
      return response.data;
    } catch (error) {
      return { id: vehicleId, error: 'No se pudo obtener información del vehículo' };
    }
  }

  async updateAssignment(
    userId: string,
    vehicleId: string,
    updateAssignmentDto: UpdateAssignmentDto,
  ): Promise<Assignment> {
    const assignment = await this.assignmentRepository.findOne({
      where: { userId, vehicleId },
    });
    if (!assignment) {
      throw new NotFoundException('Asignación no encontrada');
    }

    const previousState = { ...assignment };
    Object.assign(assignment, updateAssignmentDto);
    const updated = await this.assignmentRepository.save(assignment);
    await this.recordHistory(userId, vehicleId, ActionType.MODIFICACION, previousState, { ...updated });
    return updated;
  }
}
