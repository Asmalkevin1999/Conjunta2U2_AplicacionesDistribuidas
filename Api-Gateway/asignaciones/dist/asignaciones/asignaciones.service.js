"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsignacionesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const assignment_entity_1 = require("./entities/assignment.entity");
const assignment_history_entity_1 = require("./entities/assignment-history.entity");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let AsignacionesService = class AsignacionesService {
    assignmentRepository;
    historyRepository;
    httpService;
    httpClient;
    constructor(assignmentRepository, historyRepository, httpService) {
        this.assignmentRepository = assignmentRepository;
        this.historyRepository = historyRepository;
        this.httpService = httpService;
        this.httpClient = this.httpService.axiosRef;
    }
    async recordHistory(userId, vehicleId, action, previousState, newState) {
        const history = new assignment_history_entity_1.AssignmentHistory();
        history.userId = userId;
        history.vehicleId = vehicleId;
        history.action = action;
        history.previousState = previousState ?? null;
        history.newState = newState ?? null;
        await this.historyRepository.save(history);
    }
    async assignVehicle(assignVehicleDto) {
        const existing = await this.assignmentRepository.findOne({
            where: {
                vehicleId: assignVehicleDto.vehicleId,
                active: true,
            },
        });
        if (existing && existing.userId !== assignVehicleDto.userId) {
            throw new common_1.ConflictException('El vehículo ya está asignado a otro propietario activo');
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
            await this.recordHistory(assignVehicleDto.userId, assignVehicleDto.vehicleId, assignment_history_entity_1.ActionType.MODIFICACION, previousState, { ...updated });
            return updated;
        }
        const newAssignment = this.assignmentRepository.create({
            userId: assignVehicleDto.userId,
            vehicleId: assignVehicleDto.vehicleId,
            active: true,
        });
        const saved = await this.assignmentRepository.save(newAssignment);
        await this.recordHistory(assignVehicleDto.userId, assignVehicleDto.vehicleId, assignment_history_entity_1.ActionType.CREACION, null, {
            ...saved,
        });
        return saved;
    }
    async removeAssignment(userId, vehicleId) {
        const assignment = await this.assignmentRepository.findOne({
            where: { userId, vehicleId, active: true },
        });
        if (!assignment) {
            throw new common_1.NotFoundException('Asignación no encontrada');
        }
        const previousState = { ...assignment };
        assignment.active = false;
        const updated = await this.assignmentRepository.save(assignment);
        await this.recordHistory(userId, vehicleId, assignment_history_entity_1.ActionType.ELIMINACION, previousState, { ...updated });
    }
    async findAssignmentsByUser(userId) {
        const assignments = await this.assignmentRepository.find({
            where: { userId, active: true },
        });
        const results = await Promise.all(assignments.map(async (assignment) => {
            const vehicle = await this.fetchVehicle(assignment.vehicleId);
            return {
                userId: assignment.userId,
                vehicleId: assignment.vehicleId,
                active: assignment.active,
                assignedAt: assignment.createdAt,
                vehicle,
            };
        }));
        return results;
    }
    async fetchVehicle(vehicleId) {
        const vehiculosHost = process.env.VEHICULOS_HOST || 'http://vehiculos:3001';
        const url = `${vehiculosHost}/vehiculos/${vehicleId}`;
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url));
            return response.data;
        }
        catch (error) {
            return { id: vehicleId, error: 'No se pudo obtener información del vehículo' };
        }
    }
    async updateAssignment(userId, vehicleId, updateAssignmentDto) {
        const assignment = await this.assignmentRepository.findOne({
            where: { userId, vehicleId },
        });
        if (!assignment) {
            throw new common_1.NotFoundException('Asignación no encontrada');
        }
        const previousState = { ...assignment };
        Object.assign(assignment, updateAssignmentDto);
        const updated = await this.assignmentRepository.save(assignment);
        await this.recordHistory(userId, vehicleId, assignment_history_entity_1.ActionType.MODIFICACION, previousState, { ...updated });
        return updated;
    }
};
exports.AsignacionesService = AsignacionesService;
exports.AsignacionesService = AsignacionesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(assignment_entity_1.Assignment)),
    __param(1, (0, typeorm_1.InjectRepository)(assignment_history_entity_1.AssignmentHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        axios_1.HttpService])
], AsignacionesService);
