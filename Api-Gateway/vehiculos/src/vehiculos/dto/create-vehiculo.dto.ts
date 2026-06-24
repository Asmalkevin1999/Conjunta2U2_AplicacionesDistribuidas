import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsIn, IsInt, IsNotEmpty, IsNumber, IsString, Matches, Max, MaxLength, Min, MinLength, ValidateNested } from "class-validator";

export class BaseVehiculoDto {
    
    @ApiProperty({ description: 'Placa del vehículo', example: 'ABC-1234' })
    @IsString()
    @IsNotEmpty()
    @Matches(/^[A-Z]{3}-\d{4}$/, {
        message: "La placa debe tener el formato ABC-1234"
    })
    placa!: string;


    @ApiProperty({ description: 'Marca del vehículo', example: 'Toyota', minLength: 2, maxLength: 30 })
    @IsString()
    @IsNotEmpty()
    @MinLength(2, {
        message: "La marca debe tener al menos 2 caracteres"
    })
    @MaxLength(30, {
        message: "La marca no debe exceder los 30 caracteres"
    })
    @Matches(/^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ.,\-#&()]+$/, {
        message: "La marca solo puede contener letras y espacios"
    })
    marca!: string;


    @ApiProperty({ description: 'Modelo del vehículo', example: 'Corolla', minLength: 2, maxLength: 150 })
    @IsString()
    @IsNotEmpty()
    @MinLength(2, {
        message: "El modelo debe tener al menos 2 caracteres"
    })
    @MaxLength(150, {
        message: "El modelo no debe exceder los 150 caracteres"
    })
    @Matches(/^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ.,\-#&()]+$/, {
        message: "El modelo solo puede contener letras y espacios"
    })
    modelo!: string;


    @ApiProperty({ description: 'Color del vehículo', example: 'Rojo', minLength: 2, maxLength: 150 })
    @IsString()
    @IsNotEmpty()
    @MinLength(2, {
        message: "El color debe tener al menos 2 caracteres"
    })
    @MaxLength(150, {
        message: "El color no debe exceder los 150 caracteres"
    })
    @Matches(/^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ.,\-#&()]+$/, {
        message: "El color solo puede contener letras y espacios"
    })
    color!: string;


    @ApiProperty({ description: 'Año del vehículo', example: 2024, minimum: 1885 })
    @Min(1885, {
        message: 'El año debe ser mayor o igual a 1885',
    })
    @Max(new Date().getFullYear() + 1, {
        message: `El año no puede ser mayor a ${new Date().getFullYear() + 1}`,
    })
    @IsInt({
        message: 'El año debe ser un número entero',
    })
    anio!: number;

    @ApiProperty({ description: 'Clasificación del vehículo', enum: ['Electrico', 'Hibrido', 'Gasolina', 'Diesel'], example: 'Gasolina' })
    @IsString()
    @IsIn(['Electrico', 'Hibrido', 'Gasolina', 'Diesel'], {
        message: 'La clasificación debe ser: Electrico, Hibrido, Gasolina o Diesel'
    })
    clasificacion!: string;
}


export class AutoDto extends BaseVehiculoDto {

    @ApiProperty({ description: 'Número de puertas del auto', example: 4, minimum: 2, maximum: 5 })
    @Min(2, {
        message: "El número de puertas debe ser al menos 2"
    })
    @Max(5, {
        message: "El número de puertas no debe exceder 5"
    })
    @IsInt({message: "El número de puertas debe ser un número entero"})
    numeroPuertas!: number;

    @ApiProperty({ description: 'Capacidad del maletero en litros', example: 470, minimum: 0 })
    @Min(0, {
        message: "La capacidad del maletero debe ser un número positivo"
    })
    @IsInt({message: "La capacidad del maletero debe ser un número entero"})
    capacidadMaletero!: number;
}


export class MotoDto extends BaseVehiculoDto {

    @ApiProperty({ description: 'Placa de la motocicleta', example: 'AB-123C' })
    @IsString()
    @IsNotEmpty()
    @Matches(/^[A-Z]{2}-\d{3}[A-Z]$/, {
        message: "La placa de la motocicleta debe tener el formato AB-123C"
    })
    declare placa: string;

    @ApiProperty({ description: 'Tipo de motocicleta', enum: ['Deportivo', 'Scooter', 'Motocross'], example: 'Deportivo' })
    @IsString()
    @IsNotEmpty()
    @Matches(/^(Deportivo|Scooter|Motocross)$/, {
        message: "El tipo de motocicleta debe ser Deportivo, Scooter o Motocross"
    })
    tipoMoto!: string;
}


export class CamionetaDto extends BaseVehiculoDto {

    @ApiProperty({ description: 'Tipo de cabina', example: 'Simple', maxLength: 150 })
    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ.,\-#&()]+$/, {
        message: "La cabina solo puede contener letras y espacios"
    })
    cabina!: string;

    @ApiProperty({ description: 'Capacidad de carga en kg', example: 1500, minimum: 0, maximum: 100000 })
    @Min(0, {
        message: "La capacidad de carga debe ser un número positivo"
    })
    @Max(100000, {
        message: "La capacidad de carga no debe exceder los 100000 kg"
    })
    @IsInt({message: "La capacidad de carga debe ser un número entero"})
    capacidadCarga!: number;
}


export class CreateVehiculoDto {
  @ApiProperty({ description: 'Tipo de vehículo', enum: ['auto', 'moto', 'camioneta'], example: 'auto' })
  @IsIn(['auto', 'moto', 'camioneta'])
  tipo!: string;

  @ApiProperty({
    description: 'Datos específicos del vehículo según el tipo',
    oneOf: [
      { $ref: '#/components/schemas/AutoDto' },
      { $ref: '#/components/schemas/MotoDto' },
      { $ref: '#/components/schemas/CamionetaDto' },
    ],
    discriminator: {
      propertyName: 'tipo',
      mapping: {
        auto: '#/components/schemas/AutoDto',
        moto: '#/components/schemas/MotoDto',
        camioneta: '#/components/schemas/CamionetaDto',
      },
    },
  })
  @ValidateNested()
  @Type((opts) => {
    const object = opts?.object as CreateVehiculoDto;
    if (!object) return BaseVehiculoDto;

    switch (object.tipo) {
      case 'auto':
        return AutoDto;
      case 'moto':
        return MotoDto;
      case 'camioneta':
        return CamionetaDto;
      default:
        return BaseVehiculoDto;
    }
  })
  datos!: AutoDto | MotoDto | CamionetaDto;
}
