import { Injectable, EventEmitter, Output } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/filter';
//import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
//import { of } from 'rxjs/observable/of';
import { NodeModel } from '../models/node.model';
import { TableModel } from '../models/table.model';
import { TNodeModel } from '../models/table-node.model';
import { NotificationsService } from 'angular2-notifications';

@Injectable()
export class TableService {

  // Urls
  private newTableUrl = 'http://psing/app_dev.php/api/tables/new';  // URL to web API
  private putTableUrl = 'http://psing/app_dev.php/api/tables';
  private getTablesUrl = 'http://psing/app_dev.php/api/tables';

  // Table variables
  private currentTable: TableModel;
  private currentTableChange: Subject<TableModel> = new Subject<TableModel>();

  // Spreadsheet variables
  public spreadsheetChange: Subject<{data: any[], colHeaders: (string | number)[], columns: any[], /*colWidths: number[],*/ options: any}> = new Subject<{data: any[], colHeaders: (string | number)[], columns: any[], /*colWidths: number[],*/ options: any}>();
  private uniqueTaxons: any[] = [];
  public data: any[] = [];
  public colHeaders: (string | number)[] = [];
  public columns: any;
  public colWidths: number[] = [];
  public options: any = {};
  private tableHasChanged: boolean = false;

  // Map variables
  public mapChange: Subject<{map: L.Map, geoJsons: any}> = new Subject<{map: L.Map, geoJsons: any}>();
  public map: L.Map;
  public geoJsons: any;
  public geojsonMarkerOptions = { // see http://leafletjs.com/examples/geojson/
    radius: 3,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  };

  constructor(private http: Http, private notificationsService: NotificationsService) {
    this.currentTableChange.subscribe((value) => {
      this.currentTable = value;
      this.updateTable();
      this.updateMap();
    });
    this.spreadsheetChange.subscribe((value) => {
      this.data = value.data;
      this.colHeaders = value.colHeaders;
      this.columns = value.columns;
      /*this.colWidths = value.colWidths;*/
      this.options = value.options;
    })
    this.mapChange.subscribe((value) => {
      this.map = value.map;
      this.geoJsons = value.geoJsons;
    });
  }

  public getNewEmptyTable() {
    let httpRequest = this.http.get(this.newTableUrl)
    .map(res => res.json() as NodeModel)
    .catch((e) => {
      return Observable.empty();
    });
    return httpRequest;
  }

  public setCurrentTable(table: TableModel) {
    this.currentTable = table;
    //this.currentTableChange.next(table);
  }

  public changeCurrentTable(table: TableModel) {
    this.currentTableChange.next(table);
  }

  public getCurrentTable(): TableModel {
    return this.currentTable;
  }

  public pushNodesOnTable(nodes: Array<NodeModel>, table: TableModel) {
    let existingNodesInTable: Array<NodeModel> = [];
    for(let node of nodes) {
      let alreadyExist: boolean = false;
      if(table.tNodes) {
        for(let n of table.tNodes) {
          if(n.node.id == node.id) alreadyExist = true;
        }
      }

      let tNode: TNodeModel = {
        id: 0,
        position: table.tNodes.length,
        groupSocio: 'group1',
        table: table,
        node: node
      };

      !alreadyExist ? table.tNodes.push(tNode) : existingNodesInTable.push(node);
    }

    if(existingNodesInTable.length > 0) {
      if(existingNodesInTable.length == 1) {
        this.notificationsService.info('', `Le relevé n° ${existingNodesInTable[0].id} existe déjà dans le tableau, il n'a pas été ajouté`);
    } else {
        const nodesDblIds: Array<number> = [];
        existingNodesInTable.forEach(node => {
          nodesDblIds.push(node.id);
        });
        this.notificationsService.info('', `${nodesDblIds.length} relevés existent déjà dans le tableau (n° ${nodesDblIds.toString()}), ils n'ont pas été ajoutés`);
      }
    }
    this.currentTableChange.next(table);
    console.log(table);
  }

  public mergeWithCurrentTable(table: TableModel) {
    let nodesToBePushed: Array<NodeModel> = [];
    table.tNodes.forEach(tNode => {
      nodesToBePushed.push(tNode.node);
    });
    this.pushNodesOnTable(nodesToBePushed, this.currentTable);
  }

  // The magic of Angular ends here !
  // Angular won't detect changes (ngOnChanges) for nested objects as @Input
  public reAssignCurrentTable(){
    this.currentTable = Object.assign({}, this.currentTable);
    this.updateTable();
  }

  public getNodes(table: TableModel): Array<NodeModel> {
    const nodes: Array<NodeModel> = [];
    table.tNodes.forEach(tNode => {
      nodes.push(tNode.node);
    });
    return nodes;
  }

  private getUniqueLevelsFromNodes(nodes: Array<NodeModel>): Array<string> {
    let levels: Array<string> = [];
    for(let node of nodes) {
      if(levels.find(l => l == node.level)) {
        // do nothing
      } else {
        levels.push(node.level);
      }
    }
    return levels;
  }

  // Return true if :
  //   - only 1 level
  //   - 2 levels that must be a synusy and a microcenosis
  // Todo (?) : allows phytocenosis to be merger with synusy and microcenosis
  public nodesLevelsAreCompatibleForMerging(nodes: Array<NodeModel>): boolean {
    let uniqueLevels: Array<string> = this.getUniqueLevelsFromNodes(nodes);
    if(uniqueLevels.length === 0) throw new Error("Error in 'table.service'. 'nodes' is empty.");
    if(uniqueLevels.length === 1) return true;
    if(uniqueLevels.length > 1) {
      if(uniqueLevels.length === 2 
        && (
          (uniqueLevels[1] === 'synusy' || uniqueLevels[1] === 'microcenosis'))
          || (uniqueLevels[2] === 'microcenosis' || uniqueLevels[2] === 'synusy')) {
            return true;
          } else {
            throw new Error("Error in 'table.service'. 'nodes' levels are incompatible to be merged.");
          }
    }
  }

  private getAllSingleTaxons(nodes: Array<NodeModel>): any[] {
    let taxons = [];
    for(let node of nodes) {
      for(let n of node.children) {
        // Todo : multiple validations capabilities
        let i = -1;i++;
        let tempData: (string | number)[] = []; //[n.repository, n.validations[0].repositoryIdNomen, n.validations[0].validatedName];
        tempData['repository'] = n.repository;
        tempData['repositoryIdNomen'] = n.validations[0].repositoryIdNomen;
        tempData['repositoryIdTaxo'] = n.validations[0].repositoryIdTaxo;
        tempData['validatedName'] = n.validations[0].validatedName;
        tempData['coef'] = n.coef;
        tempData['concatId'] = tempData['repository']+'--'+tempData['repositoryIdNomen']+'--'+tempData['validatedName'];
        taxons.push(tempData);
      }
    }
    return taxons;
  }

  public countSubNodes(nodes: Array<NodeModel>): number {
    let count: number = 0;
    for(let node of nodes) {
      //for(let n of node.children) {
        count++;
      //}
    }
    return count;
  }

  public getUniqueTaxons(nodes: Array<NodeModel>): (string | number)[] {
  
    // get all single taxons
    let taxons = this.getAllSingleTaxons(nodes);

    // remove duplicates (merge taxons)
    let uniqueTaxons = [];
    let dblCount: number = 0;
    uniqueTaxons[0] = taxons[0];
    for(let i=0;i<taxons.length;i++) {
      for(let j=0;j<uniqueTaxons.length;j++) {
        if(uniqueTaxons[j]['concatId'] == taxons[i]['concatId']) {
          dblCount++;
        }
      }
      if(dblCount == 0) {
        uniqueTaxons.push(taxons[i]);
      }
      dblCount = 0;
    }

    // coef
    let coef: (string)[] = [];
    let nbNodes = this.countSubNodes(nodes);
    let i: number = 0;

    for(let ut of uniqueTaxons) {
      for(let node of nodes) {
        for(let n of node.children) {
          let v = n.validations[0];
          let concatId = v.repository+'--'+v.repositoryIdNomen+'--'+v.validatedName;
          if(concatId == ut['concatId']) {
            coef.push(n.coef);
          } else {
            i++;
          }
          if(i == node.children.length) {
            coef.push('.');
          }
        }
        i = 0;
      }
      ut['coef'] = coef;
      coef = [];
    }
    return uniqueTaxons;
  }

  public constructTableHeader(nodes: Array<NodeModel>): (string | number)[] {
    let columnsHeader: (string | number)[] = [];
    let columnsLength: number = 0;
    let taxons = this.getAllSingleTaxons(nodes);

    columnsLength = this.countSubNodes(nodes);
    columnsHeader.push('ref');
    columnsHeader.push('nomen');
    columnsHeader.push('taxon');
    for(let i=1;i<=columnsLength;i++) columnsHeader.push(i);

    return columnsHeader;
  }

  public updateTable(): void {
    const tableTNodesItems = this.currentTable.tNodes;
    const nodesItems: Array<NodeModel> = [];
    tableTNodesItems.forEach(tNode => {
      nodesItems.push(tNode.node);
    });

    this.uniqueTaxons = this.getUniqueTaxons(nodesItems);
    const data = this.uniqueTaxons;
    const colHeaders = this.constructTableHeader(nodesItems);

    const columns= [
      {
        data: 'repository'
      },
      {
        data: 'repositoryIdNomen',
        renderer: 'text',
        readOnly: true
      },
      {
        data: 'validatedName',
        readOnly: true
      }
    ];
    
    let nbSubNodes = this.countSubNodes(nodesItems);
    
    //const colWidths= [null, null, 300];

    for(let i=0;i<nbSubNodes;i++) {
      let columnMeta: { data: any } = { data: null};
      columnMeta.data = `coef.${i}`;
      columns.push(columnMeta);
      //colWidths.push(12);
    }

    const options = {
      stretchH: 'none',
      rowHeaders: true,
      columnSorting: false,
      contextMenu: [
        'row_above', 'row_below', 'remove_row'
      ],
      manualColumnMove: true,
      manualRowMove: true,
      manualColumnResize: true,
      manualRowResize: true
    };
    this.spreadsheetChange.next({data, colHeaders, columns, /*colWidths,*/ options});
    this.markCurrentTableIsUpToDate();
  }

  
  public updateMap(): void {
    let geoJsons: any = [];
    let map: L.Map = this.map;
    try {
      const nodes = this.getNodes(this.currentTable);
      nodes.forEach(node => {
        geoJsons.push(node.geoJson);
      });

      L.geoJSON(geoJsons, {
        pointToLayer: (feature, latlng) => {
          return L.circleMarker(latlng, this.geojsonMarkerOptions);
        }
      }).addTo(map);
      this.mapChange.next({map: map, geoJsons: geoJsons});
    }catch(e) {
      //console.log(e);
    }
  }

  public register(table: TableModel) {
    // Avoid circular reference (TNode contains a table ref. == this table)
    const jsonTable = JSON.stringify(table, function(key, value) {
      if(key == 'table') { return value.id; }
      else { return value; }
    });

    let httpRequest = this.http.put(
      this.putTableUrl, jsonTable)
      .map(res => res.json() as TableModel)
      .catch((e: any) => {
        return Observable.empty();
      });
    return httpRequest;
  }

  public getColHeaders(): any {
    return this.colHeaders;
  }

  public getColumns():any {
    return this.columns;
  }

  public getColWidths(): any {
    return this.colWidths;
  }

  public getOptions(): any {
    return this.options;
  }

  public getData(): any {
    return this.data;
  }
  public markCurrentTableHasChanged() {
    this.tableHasChanged = true;
  }

  public markCurrentTableIsUpToDate() {
    this.tableHasChanged = false;
  }

  public currentTableIsUpToDate() {
    let state: boolean;
    this.tableHasChanged ? state = false : state = true;
    return state;
  }

  private generateConcatId(node: (NodeModel | any)): string {
    let v = node.validations[0];
    let repo: string;
    let nomen: string;
    let validatedName: string;

    repo = v.repository;
    v.repositoryIdNomen ? nomen = v.repositoryIdNomen : nomen = v.repository_id_nomen;
    v.validatedName ? validatedName = v.validatedName : validatedName = v.validated_name;

    return repo+'--'+nomen+'--'+validatedName;
  }

  public getAllTables(): Observable<Array<TableModel>> {
    let httpRequest = this.http.get(this.getTablesUrl)
    .map(res => res.json() as TableModel)
    .catch((e) => {
      return Observable.empty();
    });
    return httpRequest;
  }
  
}
