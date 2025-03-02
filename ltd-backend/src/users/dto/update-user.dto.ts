import { IsString, IsBoolean, IsOptional, IsNumber } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    email?: string;
    
    @IsString()
    @IsOptional()
    name?: string;
  
    @IsString()
    @IsOptional()
    surname?: string;

    @IsString()
    @IsOptional()
    phoneNumber?: string;

    @IsNumber()
    @IsOptional()
    age?: number;
  
    @IsBoolean()
    @IsOptional()
    active?: boolean;
}
