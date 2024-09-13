import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { CharacteristicProductService } from './characteristicproduct.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { CharacteristicProductEntity } from './characteristicproduct.entity';
import { CharacteristicproductDto } from './characteristicproduct.dto';
import { plainToInstance } from 'class-transformer';


@Controller('characteristicproduct')
export class CharacteristicproductController {
    constructor(private readonly characteristicproductService: CharacteristicProductService){}

    @Get()
    async findAll() {
        return await this.characteristicproductService.findAll();
    }

    @Get(':characteristicproductId')
    async findOne(@Param('characteristicproductId') characteristicproductId: string) {
        return await this.characteristicproductService.findOne(characteristicproductId);
    }

    @Post()
    async create(@Body() characteristicproductDto: CharacteristicproductDto) {
        const product: CharacteristicProductEntity = plainToInstance(CharacteristicProductEntity, characteristicproductDto);
        return await this.characteristicproductService.create(product);
    }

    @Put(':characteristicproductId')
    async update(@Param('characteristicproductId') characteristicproductId: string, @Body() characteristicproductDto: CharacteristicproductDto) {
        const product: CharacteristicProductEntity = plainToInstance(CharacteristicProductEntity, characteristicproductDto);
        return await this.characteristicproductService.update(characteristicproductId, product);
    }

    @Delete(':characteristicproductId')
    @HttpCode(204)
    async delete(@Param('characteristicproductId') characteristicproductId: string) {
        return await this.characteristicproductService.delete(characteristicproductId);
    }
}
