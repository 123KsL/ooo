import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'onepipe'
})
export class OnepipePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    console.log(value,...args)
    return value +'1';
  }

}
