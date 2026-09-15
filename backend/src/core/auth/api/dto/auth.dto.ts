import { IsEmail, IsString, MinLength, ValidateIf } from 'class-validator';

export class RegisterDto {
  @IsString() name!: string;
  @IsEmail() email!: string;
  @IsString() @MinLength(8) password!: string;
  @ValidateIf((value: RegisterDto) => value.passwordConfirmation !== undefined)
  @IsString() passwordConfirmation?: string;
}

export class LoginDto {
  @IsEmail() email!: string;
  @IsString() password!: string;
}

export class RefreshDto { @IsString() refreshToken!: string }
