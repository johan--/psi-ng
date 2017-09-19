import { Component, OnInit } from '@angular/core';
import { ValidationModel } from '../models/validation.model';

@Component({
  selector: 'psi-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.css']
})
export class ValidationComponent implements ValidationModel {
  constructor() { }

  repository: string;
  repositoryIdTaxo: number;
  repositoryIdNomen: number;
  inputName: string;
  validatedName: string;
  validName: string;

}
