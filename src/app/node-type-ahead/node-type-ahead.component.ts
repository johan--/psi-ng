import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NodeService } from '../services/node.service';
import { NodeModel } from '../models/node.model';

@Component({
  selector: 'psi-node-type-ahead',
  templateUrl: './node-type-ahead.component.html',
  styleUrls: ['./node-type-ahead.component.css']
})
export class NodeTypeAheadComponent implements OnInit {

  input = new FormControl();
  nodes: Array<NodeModel> = [];

  constructor(private nodeService: NodeService) { }

  ngOnInit() {
    /*this.input.valueChanges
    .subscribe(value => {
      this.nodeService.listNodes()
        .subscribe(nodes => this.nodes = nodes)
    });*/
  }

}
