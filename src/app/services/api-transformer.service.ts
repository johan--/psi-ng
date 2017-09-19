import { Injectable } from '@angular/core';

@Injectable()
export class ApiTransformerService {

  constructor() { }

  /**
   * @input: any in fact, it's an array of baeflor objects from the API
   * return an array of terms
   * This function is a transformer to provide ad hoc data to the typehead
   */ 
  baseflorToTypeahead(input: any): Array<string> {
    let output: Array<string> = [];
    input.forEach(element => {
      output.push(element.scientific_name);
    });
    return output;
  }

}
