import { Routes } from '@angular/router';
import { TableComponent } from './table/table.component';
import { NodeRegisterComponent } from './node-register/node-register.component';
import { NodeSearchComponent } from './node-search/node-search.component';
import { TableSearchComponent} from './table-search/table-search.component';

export const ROUTES: Routes = [
  { path: 'table', component: TableComponent },
  { path: 'node-register', component: NodeRegisterComponent },
  { path: 'node-search', component: NodeSearchComponent },
  { path: 'table-search', component: TableSearchComponent }
  ];
