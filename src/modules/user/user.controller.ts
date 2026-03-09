import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from './user.service';

import { Role } from 'generated/prisma/client';
import { UpdateUserDto } from './dto/updateUser.dto';
import { GetCurrentUserId } from 'src/common/decorators/getCurrentUserId.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UpdateUserRoleDto } from './dto/updateUserRole.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  getMe(@GetCurrentUserId() userId: string) {
    return this.userService.findById(userId);
  }

  @Patch('update')
  updateMe(
    @GetCurrentUserId() userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateMe(userId, updateUserDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.userService.findAll();
  }

  @Patch(':id/role')
  @Roles(Role.SUPER_ADMIN)
  updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateUserRoleDto,
  ) {
    return this.userService.updateRole(id, body.role);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.remove(id);
  }
}
