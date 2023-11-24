import { Injectable } from '@nestjs/common';

import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/comon/adapters/axios.adapter';


@Injectable()
export class SeedService {



  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
  ) { }

  async executeSeed() {

    await this.pokemonModel.deleteMany({}) //Para empezar de cero y notener que estar elimionado desde la base de datos


    // console.log(fetch) //todo: El fetch solo se puede usar a partir del node version 18 
    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10275');

    const pokemonToInsert: { name: string, no: number }[] = [];



    // extraer el ID que esta dentro de https://pokeapi.co/api/v2/pokemon?limit=600
    data.results.forEach(async ({ name, url }) => {
      // console.log({ name, url });

      const segemnts = url.split('/'); //todoCortar en segmentos la url para teber variables dando esto : 
      // console.log(segemnts);           //todo [ 'https:', '', 'pokeapi.co', 'api', 'v2', 'pokemon', '1', '' ]
      const no = +segemnts[segemnts.length - 2]; //Para obtener el penultimo segemento o variable

      // const pokemon = await this.pokemonModel.create({ name, no });
      pokemonToInsert.push({ name, no });

    });
    await this.pokemonModel.insertMany(pokemonToInsert); //Se va insertar una inserccion con un monton de entradas de arreglos y asi sea mas rapido 

    return 'Excuted';
  }

}
