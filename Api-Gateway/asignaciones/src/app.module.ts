import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsignacionesModule } from './asignaciones/asignaciones.module';
import { Assignment } from './asignaciones/entities/assignment.entity';
import { AssignmentHistory } from './asignaciones/entities/assignment-history.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: Number(configService.get('DB_PORT', 5432)),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_DATABASE', 'asignaciones_db'),
        entities: [Assignment, AssignmentHistory],
        synchronize: configService.get('DB_SYNCHRONIZE', 'true') === 'true',
        logging: false,
      }),
    }),
    AsignacionesModule,
  ],
})
export class AppModule {}
