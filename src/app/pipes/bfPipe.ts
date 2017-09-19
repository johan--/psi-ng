import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'bf'})
export class bfPipe implements PipeTransform {
  output: Array<string> = [];

  transform(bfObject: any): Array<string> {
    if(bfObject) {
      //bfObject.forEach(item => {
        this.output.push(bfObject.scientific_name);
      //});
    }
    return this.output;
  }
}