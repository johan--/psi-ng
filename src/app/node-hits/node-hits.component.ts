import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { AlgoliaService } from '../services/algolia.service';
import { connectHits } from 'instantsearch.js/es/connectors';
import { NodeModel } from '../models/node.model';

@Component({
  selector: 'psi-node-hits',
  templateUrl: './node-hits.component.html',
  styleUrls: ['./node-hits.component.css']
})
export class NodeHitsComponent implements OnInit {
  @Input() divVisible: boolean = false;
  @Output() validatedSyntaxon = new EventEmitter<NodeModel>();

  node: { hits: {}[] } = { hits: [] };

  constructor(private algoliaService: AlgoliaService) { }

  ngOnInit() {
    const widget = connectHits(this.updateNode);
    this.algoliaService.basevegSearch.addWidget(widget());
  }

  updateNode = (node, isFirstRendering) => {
    if(isFirstRendering) {
      return Promise.resolve().then(() => {
        this.node = node;
      })
    }
    this.node = node;
  }

  clicked(hit: NodeModel) {
    this.validatedSyntaxon.emit(hit);
    this.divVisible  = false;
  }

}
