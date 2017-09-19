import { TNodeModel } from './table-node.model';

export interface TableModel {
  id: number;
  name: string;
  author: any;
  tNodes: Array<TNodeModel>;
}