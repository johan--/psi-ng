import { Component, OnInit } from '@angular/core';
import { NodeService } from '../services/node.service';
import { TableService } from '../services/table.service';
import { NodeModel } from '../models/node.model';
import { TableModel } from '../models/table.model';
import { TNodeModel } from '../models/table-node.model';
import { Observable } from 'rxjs/Observable';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'psi-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  constructor(private nodeService: NodeService, private tableService: TableService, private notificationsService: NotificationsService) { }
  
  private nodes: Array<NodeModel> = [];
  private uniqueTaxons: any[] = [];

  private data: any = this.tableService.data;
  private colHeaders: any = this.tableService.colHeaders;
  private columns: any = this.tableService.columns;
  private colWidths: any = this.tableService.colWidths;
  private options: any = this.tableService.options;
  private currentTable: TableModel = this.tableService.getCurrentTable();

  panelVisibility: boolean = true;
  showPanelButtonVisibility: string = 'hidden';
  panelDirection: string = 'vertical';
  subPanelDirection: string = 'horizontal';
  mapIsVisible: boolean = true;
  metadataIsVisible: boolean = true;
  flexDirectionPanel: string= 'row';
  flexWrapPanel: string = 'wrap';
  flexDisplayPanel: string = 'row';
  mapOrder: number = 100;

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
        this.notificationsService.success('Votre tableau a bien été sauvegardé');
      },
      (e) => {
        console.log(e);
      }
    )
  }

  togglePanelDirection() {
    this.panelDirection == 'vertical' ? this.panelDirection = 'horizontal' : this.panelDirection = 'vertical';
    this.panelDirection == 'vertical' ? this.subPanelDirection = 'horizontal' : this.subPanelDirection = 'vertical';
    this.panelDirection == 'vertical' ? this.flexDirectionPanel = 'row' : this.flexDirectionPanel = 'column-reverse';
    this.panelDirection == 'vertical' ? this.flexWrapPanel = 'wrap' : this.flexWrapPanel = 'wrap-reverse';
    this.panelDirection == 'vertical' ? this.mapOrder = 100 : this.mapOrder = 1;
    this.panelDirection == 'vertical' ? this.flexDisplayPanel = 'block' : this.flexDisplayPanel = 'flex';
  }

  toggleMapVisibility() {
    this.mapIsVisible ? this.mapIsVisible = false : this.mapIsVisible = true;
  }

  toggleMetadataVisibility() {
    this.metadataIsVisible ? this.metadataIsVisible = false : this.metadataIsVisible = true;
  }

  openPanel() {
    this.panelVisibility = true;
    this.showPanelButtonVisibility = 'hidden';
  }

  closePanel() {
    this.panelVisibility = false;
    this.showPanelButtonVisibility = 'visible';
  }

  // User is dragging the panel
  panelDrag() {
    this.tableService.tablePanelSizeChange.next({changed: true});
  }

}
