import { IsNotEmpty } from "class-validator"

export class CreateFoodCategoryDto {
    @IsNotEmpty({
        message: "Name không được để trống!!!"
    })
    name: string

    @IsNotEmpty({
        message: "Name không được để trống!!!"
    })
    description?: string
}
