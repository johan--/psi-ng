import { Component, OnInit, Input } from '@angular/core';
import { TableService } from '../services/table.service';

@Component({
  selector: 'psi-table-spreadsheet',
  templateUrl: './table-spreadsheet.component.html',
  styleUrls: ['./table-spreadsheet.component.css']
})
export class TableSpreadsheetComponent implements OnInit {  
  @Input() currentTable: any;

  private data: any = this.tableService.data;
  private colHeaders: any = this.tableService.colHeaders;
  private columns: any = this.tableService.columns;
  private colWidths: any = this.tableService.colWidths;
  private options: any = this.tableService.options;

  constructor(private tableService: TableService) {
    this.tableService.spreadsheetChange.subscribe((value) => {
      this.data = value.data;
      this.colHeaders = value.colHeaders;
      this.columns = value.columns;
      this.colWidths = value.colWidths;
      this.options = value.options;
    });
  }

  ngOnInit() {
//console.log(this.data);
  }

  columnMoved(columns, target) {
    console.log('column moved !');
    console.log(columns);
    console.log(target);
  }

}
