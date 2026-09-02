import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '@prisma/client';

/**
 * Data Transfer Object for Creating a New User.
 * Defines validation constraints and Swagger UI documentation properties.
 */
export class CreateUserDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
  })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    example: 'SecurePass123!',
    description: 'Account password (minimum 8 characters)',
  })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ApiProperty({
    example: 'John',
    description: 'User first name',
  })
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'User last name',
  })
  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @ApiPropertyOptional({
    enum: UserRole,
    default: UserRole.ATTENDEE,
    description: 'User platform role (SUPER_ADMIN, TENANT_ADMIN, EXHIBITOR, ATTENDEE)',
  })
  @IsEnum(UserRole, { message: 'Invalid user role specified' })
  @IsOptional()
  role?: UserRole;
}
