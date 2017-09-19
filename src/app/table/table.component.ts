import { Component, OnInit } from '@angular/core';
import { NodeService } from '../services/node.service';
import { TableService } from '../services/table.service';
import { NodeModel } from '../models/node.model';
import { TableModel } from '../models/table.model';
import { TNodeModel } from '../models/table-node.model';
import { Observable } from 'rxjs/Observable';
import { MdSnackBar } from '@angular/material';

@Component({
  selector: 'psi-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  constructor(private nodeService: NodeService, private tableService: TableService, private snackBar: MdSnackBar) { }
  
  private nodes: Array<NodeModel> = [];
  private uniqueTaxons: any[] = [];

  private data: any = this.tableService.data;
  private colHeaders: any = this.tableService.colHeaders;
  private columns: any = this.tableService.columns;
  private colWidths: any = this.tableService.colWidths;
  private options: any = this.tableService.options;
  private currentTable: TableModel = this.tableService.getCurrentTable();

  ngOnInit() {
    this.nodeService.listNodes().subscribe(
      (r: Array<NodeModel>) => { 
        this.nodes = r;
        try {
          this.tableService.nodesLevelsAreCompatibleForMerging(this.nodes);
        } catch(e) {
          console.log(e.message);
        }
      }
    );
    this.tableService.getNewEmptyTable().subscribe(
      (r: TableModel) => {
        r.tNodes = [];
        this.tableService.setCurrentTable(r);
        this.currentTable = this.tableService.getCurrentTable();
      }
    )
    
  }

  // The magic of Angular ends here !
  // Angular won't detect changes (ngOnChanges) for nested objects as @Input
  private reAssignCurrentTable(){
    this.currentTable = Object.assign({}, this.currentTable);
    this.tableService.updateTable();
  }

  private onDivClick() {
    this.tableService.updateTable();
  }

  private afterChange(e: any) {
    // tslint:disable-next-line:no-console
    console.log(e);
  }

  private afterOnCellMouseDown(e: any) {
    // tslint:disable-next-line:no-console
    console.log(e);
  }

  public registerTable(table: TableModel) {
    this.tableService.register(table).subscribe(
      (r) => {
        //console.log(r);
        this.snackBar.open(`Tableau sauvegardé`, 'fermer');
      },
      (e) => {
        console.log(e);
      }
    )
  }

}
