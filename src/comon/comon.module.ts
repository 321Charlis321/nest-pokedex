import { Module } from '@nestjs/common';
import { AxiosAdapter } from './adapters/axios.adapter';

@Module({
    providers: [
        AxiosAdapter
    ],
    exports: [AxiosAdapter] // para que se visibel fuera de esre lugar
})
export class ComonModule { }
