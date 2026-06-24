import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  Inject,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { IUserRoleService } from './interfaces/user-role-service.interface';
import { AssignRoleDto } from './dto/assign-role.dto';

@ApiTags('Asignación Roles')
@Controller('user-role')
export class UserRoleController {
  constructor(
    @Inject('IUserRoleService')
    private readonly userRoleService: IUserRoleService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Asignar un rol a un usuario' })
  @ApiResponse({ status: 201, description: 'Rol asignado exitosamente' })
  @ApiResponse({
    status: 409,
    description: 'Conflicto: la asignación ya existe',
  })
  assignRole(@Body() assignRoleDto: AssignRoleDto) {
    return this.userRoleService.assignRole(assignRoleDto);
  }

  @Delete(':idUser/:idRole')
  @ApiOperation({ summary: 'Remover asignación de rol (soft delete)' })
  @ApiResponse({ status: 200, description: 'Asignación removida exitosamente' })
  @ApiResponse({ status: 404, description: 'Asignación no encontrada' })
  removeRole(
    @Param('idUser', ParseUUIDPipe) idUser: string,
    @Param('idRole', ParseUUIDPipe) idRole: string,
  ) {
    return this.userRoleService.removeRole(idUser, idRole);
  }

  @Get('user/:idUser')
  @ApiOperation({ summary: 'Obtener roles asignados a un usuario' })
  @ApiResponse({ status: 200, description: 'Lista de roles del usuario' })
  findRolesByUser(@Param('idUser', ParseUUIDPipe) idUser: string) {
    return this.userRoleService.findRolesByUser(idUser);
  }

  @Get('role/:idRole')
  @ApiOperation({ summary: 'Obtener usuarios que tienen un rol' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios con ese rol' })
  findUsersByRole(@Param('idRole', ParseUUIDPipe) idRole: string) {
    return this.userRoleService.findUsersByRole(idRole);
  }
}
