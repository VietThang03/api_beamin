import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty({
        message:"Email không được để trống!!!"
    })
    email: string;
  
   
    @MinLength(6)
    @MaxLength(50)
    @IsNotEmpty({
        message:"Password không được để trống!!!"
    })
    password: string;
  
    @IsString()
    @IsNotEmpty({
        message: "Name không được để trống!!!"
    })
    username: string;
}

export class RegisterUserDto{
    @IsNotEmpty({
        message: "Name không được để trống!!!"
    })
    username: string

    @IsEmail({}, {
        message:"Email không hợp lệ!!!"
    })
    @IsNotEmpty({
        message:"Email không được để trống!!!"
    })
    email: string

    @IsNotEmpty({
        message:"Password không được để trống!!!"
    })
    @MinLength(6)
    @MaxLength(50)
    password: string

}
