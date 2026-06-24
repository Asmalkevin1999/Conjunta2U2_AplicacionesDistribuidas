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
import * as bcrypt from 'bcrypt';
import type { IUsersService } from './interfaces/users-service.interface';
import type { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';

@ApiTags('Usuarios')
@Controller('users')
export class UsersController {
  constructor(
    @Inject('IUsersService')
    private readonly usersService: IUsersService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un usuario' })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente',
    type: ResponseUserDto,
  })
  @ApiResponse({ status: 409, description: 'Conflicto: username ya existe' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios',
    type: [ResponseUserDto],
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado',
    type: ResponseUserDto,
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado',
    type: ResponseUserDto,
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const data: Partial<User> = {};
    if (updateUserDto.username !== undefined)
      data.username = updateUserDto.username;
    if (updateUserDto.password !== undefined) {
      const salt = await bcrypt.genSalt();
      data.passwordHash = await bcrypt.hash(updateUserDto.password, salt);
    }
    return this.usersService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar (soft delete) un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario desactivado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.softDelete(id);
  }
}
