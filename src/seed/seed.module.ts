import { Module } from '@nestjs/common';
import { ComonModule } from 'src/comon/comon.module';

import { PokemonModule } from 'src/pokemon/pokemon.module';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';


@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    PokemonModule,// es porque se eesta exportando el MongooseModule 
    ComonModule
  ]
})
export class SeedModule { }
