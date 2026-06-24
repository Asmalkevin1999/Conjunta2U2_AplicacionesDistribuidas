import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseUUIDPipe,
  Inject,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { IRolesService } from './interfaces/roles-service.interface';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ResponseRoleDto } from './dto/response-role.dto';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(
    @Inject('IRolesService')
    private readonly rolesService: IRolesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un rol' })
  @ApiResponse({
    status: 201,
    description: 'Rol creado exitosamente',
    type: ResponseRoleDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto: el nombre del rol ya existe',
  })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los roles' })
  @ApiResponse({
    status: 200,
    description: 'Lista de roles',
    type: [ResponseRoleDto],
  })
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un rol por ID' })
  @ApiResponse({
    status: 200,
    description: 'Rol encontrado',
    type: ResponseRoleDto,
  })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un rol' })
  @ApiResponse({
    status: 200,
    description: 'Rol actualizado',
    type: ResponseRoleDto,
  })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar (soft delete) un rol' })
  @ApiResponse({ status: 200, description: 'Rol desactivado exitosamente' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.softDelete(id);
  }
}
