import { ValidationModel } from './validation.model';

export interface NodeModel {
  id: number;
  frontId: number;
  level: string;
  //canContain: Array<>;
  repository: string;
  repositoryIdNomen: number;
  name: string;
  coef: string;
  validations: Array<ValidationModel>;
  author: any;
  authorWriter: any;
  date: string;
  localization: Array<any>;
  geoJson: any;
  biblio: string;
  isDiagnosis: boolean;
  children: Array<NodeModel>;
  //meta: Array<any>;

  addChild($node: NodeModel): void;
  removeChild($node: NodeModel): void;

  addValidation($validation: ValidationModel): void;
  removeValidation($validation: ValidationModel): void;

}
