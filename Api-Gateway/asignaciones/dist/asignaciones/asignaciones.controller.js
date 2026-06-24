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
exports.AsignacionesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const asignaciones_service_1 = require("./asignaciones.service");
const assign_vehicle_dto_1 = require("./dto/assign-vehicle.dto");
const update_assignment_dto_1 = require("./dto/update-assignment.dto");
let AsignacionesController = class AsignacionesController {
    asignacionesService;
    constructor(asignacionesService) {
        this.asignacionesService = asignacionesService;
    }
    assignVehicle(assignVehicleDto) {
        return this.asignacionesService.assignVehicle(assignVehicleDto);
    }
    removeAssignment(userId, vehicleId) {
        return this.asignacionesService.removeAssignment(userId, vehicleId);
    }
    getAssignmentsByUser(userId) {
        return this.asignacionesService.findAssignmentsByUser(userId);
    }
    updateAssignment(userId, vehicleId, updateAssignmentDto) {
        return this.asignacionesService.updateAssignment(userId, vehicleId, updateAssignmentDto);
    }
};
exports.AsignacionesController = AsignacionesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Asignar un vehículo a un propietario' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Asignación creada o reactivada' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [assign_vehicle_dto_1.AssignVehicleDto]),
    __metadata("design:returntype", void 0)
], AsignacionesController.prototype, "assignVehicle", null);
__decorate([
    (0, common_1.Delete)(':userId/:vehicleId'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar una asignación activa' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Asignación desactivada y trazabilidad registrada' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'UUID del propietario' }),
    (0, swagger_1.ApiParam)({ name: 'vehicleId', description: 'UUID del vehículo' }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('vehicleId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AsignacionesController.prototype, "removeAssignment", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Consultar vehículos asignados a un propietario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de asignaciones activas por propietario' }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AsignacionesController.prototype, "getAssignmentsByUser", null);
__decorate([
    (0, common_1.Patch)(':userId/:vehicleId'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar la asignación de un vehículo' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Asignación actualizada' }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('vehicleId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_assignment_dto_1.UpdateAssignmentDto]),
    __metadata("design:returntype", void 0)
], AsignacionesController.prototype, "updateAssignment", null);
exports.AsignacionesController = AsignacionesController = __decorate([
    (0, swagger_1.ApiTags)('Asignaciones de Vehículos'),
    (0, common_1.Controller)('assignments'),
    __metadata("design:paramtypes", [asignaciones_service_1.AsignacionesService])
], AsignacionesController);
