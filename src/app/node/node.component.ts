import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NodeService } from '../services/node.service';
import { TableService } from '../services/table.service';
import { NodeModel } from '../models/node.model';
import { TableModel } from '../models/table.model';
import { ValidationModel } from '../models/validation.model';

@Component({
	selector: 'psi-node',
	templateUrl: './node.component.html',
	styleUrls: ['./node.component.css']
})

export class NodeComponent {
  @Input() node: NodeModel;

  preview: boolean = false;

	constructor(private tableService: TableService, private router: Router) {	}

  addNodeToCurrentTable(node: NodeModel) {
    this.tableService.pushNodesOnTable([node], this.tableService.getCurrentTable());
    this.tableService.markCurrentTableHasChanged();
    
    // redirect to table
    //this.router.navigate(['/']);
  }

  togglePreview() {
    this.preview ? this.preview = false : this.preview = true;
  }
	
}