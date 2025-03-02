import { IsString, IsBoolean, IsOptional, IsNumber } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    login?: string;
    
    @IsString()
    @IsOptional()
    name?: string;
  
    @IsString()
    @IsOptional()
    surname?: string;

    @IsNumber()
    @IsOptional()
    age?: number;
  
    @IsBoolean()
    @IsOptional()
    active?: boolean;
}
