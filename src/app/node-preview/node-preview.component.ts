import { Component, OnInit, Input } from '@angular/core';
import { NodeModel } from '../models/node.model';

@Component({
  selector: 'psi-node-preview',
  templateUrl: './node-preview.component.html',
  styleUrls: ['./node-preview.component.css']
})
export class NodePreviewComponent implements OnInit {

  @Input() node: NodeModel = null;

  constructor() { }

  tableView = `
    <table class="table table-sm table-inverse table-striped table-hover">
      <thead>
        <tr>
          <th>Taxon</th>
          <th>Coef.</th>
        </tr>
      </thead>
      <tbody>
  `;

  ngOnInit() {
    this.node.children.forEach(node => {
      const tableItem = `
        <tr>
          <td>${ node.validations[0].validatedName}</td>
          <td>${ node.coef }</td>
        </tr>`
      ;
      this.tableView += tableItem;
    });

    this.tableView += `</tbody></table>`;

  }

}
