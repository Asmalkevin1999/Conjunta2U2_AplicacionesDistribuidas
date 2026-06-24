import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRoleController } from './user-role.controller';
import { UserRoleService } from './user-role.service';
import { UserRole } from './entities/user-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserRole])],
  controllers: [UserRoleController],
  providers: [
    {
      provide: 'IUserRoleService',
      useClass: UserRoleService,
    },
  ],
  exports: [TypeOrmModule, 'IUserRoleService'],
})
export class UserRoleModule {}
