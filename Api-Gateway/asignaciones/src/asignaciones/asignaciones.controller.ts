import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  Get,
  Patch,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AsignacionesService } from './asignaciones.service';
import { AssignVehicleDto } from './dto/assign-vehicle.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';

@ApiTags('Asignaciones de Vehículos')
@Controller('assignments')
export class AsignacionesController {
  constructor(private readonly asignacionesService: AsignacionesService) {}

  @Post()
  @ApiOperation({ summary: 'Asignar un vehículo a un propietario' })
  @ApiResponse({ status: 201, description: 'Asignación creada o reactivada' })
  assignVehicle(@Body() assignVehicleDto: AssignVehicleDto) {
    return this.asignacionesService.assignVehicle(assignVehicleDto);
  }

  @Delete(':userId/:vehicleId')
  @ApiOperation({ summary: 'Eliminar una asignación activa' })
  @ApiResponse({ status: 200, description: 'Asignación desactivada y trazabilidad registrada' })
  @ApiParam({ name: 'userId', description: 'UUID del propietario' })
  @ApiParam({ name: 'vehicleId', description: 'UUID del vehículo' })
  removeAssignment(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('vehicleId', ParseUUIDPipe) vehicleId: string,
  ) {
    return this.asignacionesService.removeAssignment(userId, vehicleId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Consultar vehículos asignados a un propietario' })
  @ApiResponse({ status: 200, description: 'Lista de asignaciones activas por propietario' })
  getAssignmentsByUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.asignacionesService.findAssignmentsByUser(userId);
  }

  @Patch(':userId/:vehicleId')
  @ApiOperation({ summary: 'Actualizar la asignación de un vehículo' })
  @ApiResponse({ status: 200, description: 'Asignación actualizada' })
  updateAssignment(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('vehicleId', ParseUUIDPipe) vehicleId: string,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
  ) {
    return this.asignacionesService.updateAssignment(userId, vehicleId, updateAssignmentDto);
  }
}
