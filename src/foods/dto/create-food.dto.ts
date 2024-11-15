import { IsNotEmpty, IsNumber } from "class-validator"

export class CreateFoodDto {
    //name, description, price, stock, category_id
    @IsNotEmpty({
        message: "Name không được để trống!!!"
    })
    name: string

    @IsNotEmpty({
        message: "Description không được để trống!!!"
    })
    description: string

    @IsNotEmpty({
        message: "Price không được để trống!!!"
    })
    @IsNumber()
    price: number

    @IsNotEmpty({
        message: "Stock không được để trống!!!"
    })
    @IsNumber()
    stock: number

    @IsNotEmpty({
        message: "Category id không được để trống!!!"
    })
    @IsNumber()
    category_id: number

    image_url?: string
}
