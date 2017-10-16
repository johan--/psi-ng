import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { connectSearchBox } from 'instantsearch.js/es/connectors';
import { AlgoliaService } from '../services/algolia.service';
import { NodeModel } from '../models/node.model';

@Component({
  selector: 'psi-node-search-box',
  templateUrl: './node-search-box.component.html',
  styleUrls: ['./node-search-box.component.css']
})
export class NodeSearchBoxComponent implements OnInit {

  @Output() validatedSyntaxon = new EventEmitter<NodeModel>();
  @Output() validatedSyntaxonInput = new EventEmitter<string>();

  node: { query: string, refine: Function } = {
    query: '',
    refine() {}
  }
  hitsVisibility: boolean = false;

  hitsVisible(forceHide: boolean = false): boolean {
    if(forceHide == true) return false;
    if(this.node.query != '') this.hitsVisibility = true
      else this.hitsVisibility = false;
    return this.hitsVisibility;
  };

  constructor(private algoliaService: AlgoliaService) { }

  ngOnInit() {
    const widget = connectSearchBox(this.updateNode);
    this.algoliaService.basevegSearch.addWidget(widget());
  }

  updateNode = (node, isFirstRendering) => {
    if(isFirstRendering) {
      return Promise.resolve(null).then(() => {
        this.node = node;
      })
    }
    this.node = node;
  }

  handleChange(query) {
    this.node.refine(query);
  }

  selectedValidSyntaxon(node) {
    this.validatedSyntaxon.emit(node);
    this.selectedValidSyntaxonInput(this.node.query);
  }

  selectedValidSyntaxonInput(query: string) {
    this.validatedSyntaxonInput.emit(query);
  }

}
