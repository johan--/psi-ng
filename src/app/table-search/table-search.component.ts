import { Component, OnInit } from '@angular/core';
import { TableService } from '../services/table.service';
import { SidenavService } from '../services/sidenav.service';
import { TableModel } from '../models/table.model';

@Component({
  selector: 'psi-table-search',
  templateUrl: './table-search.component.html',
  styleUrls: ['./table-search.component.css']
})
export class TableSearchComponent implements OnInit {

  private tablesResult: Array<TableModel> = [];

  constructor(private tableService: TableService, private sidenavService: SidenavService) { }

  ngOnInit() {
    this.sidenavService.sideNav.open();
    this.getAllTables();
  }

  getAllTables() {
    this.tableService.getAllTables().subscribe(
      (r) => {
        this.tablesResult = r;
      }, (e) => {
        console.log(e);
      }
    )
  }

}
