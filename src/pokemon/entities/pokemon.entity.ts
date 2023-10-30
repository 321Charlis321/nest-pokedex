import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from "mongoose";

@Schema()
export class Pokemon extends Document { //para que sea considerado un docuimento en mongo db se pone extend Document 

    // id:string // el id mongo me lo da

    @Prop({ unique: true, index: true })
    name: string;

    @Prop({ unique: true, index: true })
    no: number;


}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);