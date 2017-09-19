import { TableModel } from './table.model';
import { NodeModel } from './node.model';

export interface TNodeModel {
  id: number;
  position: number;
  groupSocio: string;
  table: TableModel;
  node: NodeModel;
}
