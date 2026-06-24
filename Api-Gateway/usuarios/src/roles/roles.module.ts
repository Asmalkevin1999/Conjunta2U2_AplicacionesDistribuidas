import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { Role } from './entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RolesController],
  providers: [
    {
      provide: 'IRolesService',
      useClass: RolesService,
    },
  ],
  exports: [TypeOrmModule, 'IRolesService'],
})
export class RolesModule {}
