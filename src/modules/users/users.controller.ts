import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

/**
 * Users REST Controller.
 * Exposes user management endpoints (/api/v1/users).
 */
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /** Retrieve list of all platform users */
  @Get()
  @ApiOperation({ summary: 'List all users' })
  async findAll() {
    return this.usersService.findAll();
  }

  /** Retrieve user details by ID */
  @Get(':id')
  @ApiOperation({ summary: 'Get user details by ID' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  /** Create new platform user */
  @Post()
  @ApiOperation({ summary: 'Create a new platform user' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
