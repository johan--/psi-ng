import { Component, Input } from '@angular/core';
import { TableModel } from '../models/table.model';
import { TableService } from '../services/table.service';

@Component({
  selector: 'psi-table-card',
  templateUrl: './table-card.component.html',
  styleUrls: ['./table-card.component.css']
})
export class TableCardComponent {

  @Input() table: TableModel;

  constructor(private tableService: TableService) {}

  replaceCurrentTable(table: TableModel): void {
    //console.log(table);
    this.tableService.changeCurrentTable(table);
  }

  mergeWithCurrentTable(table: TableModel): void {
    this.tableService.mergeWithCurrentTable(table);
  }

}
