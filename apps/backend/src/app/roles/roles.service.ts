import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../permissions/entities/permission.entity';
import { PermissionsService } from '../permissions/permissions.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {

  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    private permissionsService: PermissionsService,
  ) { }

  async create(createRoleDto: CreateRoleDto) {
    const { name, permissionIds } = createRoleDto;
    const permissions: Permission[] = [];
    for (const permissionId of permissionIds) {
      const permission = await this.permissionsService.findOne(permissionId);
      if (!permission) {
        throw new NotFoundException('Uknown permission ' + permissionId);
      }

      permissions.push(permission);
    }

    const role = this.rolesRepository.create();
    role.name = name;
    role.permissions = permissions;
    return this.rolesRepository.save(role);
  }

  findAll() {
    return this.rolesRepository.find();
  }

  findOne(id: string) {
    return this.rolesRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const { name, permissionIds } = updateRoleDto;
    const role = await this.rolesRepository.findOne({
      where: { id },
    });
    if (!role) {
      throw new NotFoundException('Uknown role ' + id);
    }
    role.name = name;
    role.permissions = [];

    for (const permissionId of permissionIds) {
      const permission = await this.permissionsService.findOne(permissionId);
      if (!permission) {
        throw new NotFoundException('Uknown permission ' + permissionId);
      }
      role.permissions.push(permission);
    }

    return this.rolesRepository.save(role);
  }

  async remove(id: string) {
    const role = await this.rolesRepository.findOne({
      where: { id },
    });

    if (!role) {
      throw new NotFoundException();
    }

    return await this.rolesRepository.remove(role);
  }
}
