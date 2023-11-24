import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaginationDto } from '../comon/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {

  private defaulLimit: number;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
  ) {

    this.defaulLimit = configService.get<number>('defaultLimit')


  }


  findAll(paginationDto: PaginationDto) {

    const { limit = this.defaulLimit, offset = 0 } = paginationDto; // si no pone el usuario el limite por defecto sera 10 e igual con el oofset = 0


    return this.pokemonModel.find()
      .limit(limit)
      .skip(offset)//Para saltarse los primeros 10
      .sort({
        no: 1
      })
      .select('-__v')
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();


    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;

    } catch (error) {

      this.handleException(error);
    }


  }

  async findOne(term: string) {

    let pokemon: Pokemon;

    if (!isNaN(+term)) {//si hay un term  y convierto el term a number
      pokemon = await this.pokemonModel.findOne({ no: term })
    }
    // MONGO ID : Buscar por id
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }


    // Name : buscar por nombre
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() })
    }

    if (!pokemon) throw new NotFoundException(`Pokemon with Id , name or no "${term}" not found `)//exeption (sino eneuntra un pokemon)

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(term) //Si no encunetra mingun pokemon va a lanzar la exeptioon de arriba 
    // Si pasa de esta linea devuelv el objeto pokemon

    if (updatePokemonDto.name)//Si viene el name del pokemon lo vamos a pasar a minuscula
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();//

    try {
      await pokemon.updateOne(updatePokemonDto);
      return { ...pokemon.toJSON(), ...updatePokemonDto };//exparso todas las propiedades del pokemon con   ...pokemon.toJSON
      //y sobreescribo las propiedades que tiene el updatePokemonDto

    } catch (error) {
      this.handleException(error);
    }



  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne(); //Si hay un pokemon 
    // return { id };

    // const result = await this.pokemonModel.findByIdAndDelete(id);
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if (deletedCount === 0) {
      throw new BadRequestException(`Frase with id "${id}" not found`);
    }
    return; //aqui regrearia el status 200 de que si se elimino
    // `Frase con id ${id} Eliminado`;

  }

  private handleException(error: any) {

    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon exist in BD ${JSON.stringify(error.keyValue)}`)

    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create Pokemon - Check Server Log`);


  }
}
