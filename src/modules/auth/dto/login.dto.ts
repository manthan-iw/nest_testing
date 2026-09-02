import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

/**
 * Data Transfer Object for User Authentication Login.
 * Defines validation constraints and Swagger UI documentation properties.
 */
export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Registered user email address',
  })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'User account password',
  })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}
