import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NodeModel } from '../models/node.model';
import { NodeService } from '../services/node.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'psi-node-search',
  templateUrl: './node-search.component.html',
  styleUrls: ['./node-search.component.css']
})
export class NodeSearchComponent implements OnInit {

  public nodes: Array<NodeModel>;
  nodeF: FormGroup;

  constructor(private nodeService: NodeService, private fb: FormBuilder) { }

  ngOnInit() {
    this.nodeF = this.fb.group({
      inputSearch: this.fb.control('',),
    });
    
    let isLoading: boolean = false;
    
    this.nodeService.listNodes().subscribe(
      (result) => this.nodes = result
    )

    // Take care of value change
    this.nodeF.controls.inputSearch.valueChanges
    .debounceTime(400)
    .do(() => isLoading = true)
    .distinctUntilChanged()
    .switchMap((value) => this.nodeService.findNodesByTerm(value))
    .subscribe(
      (r) => {
        isLoading = false;
        this.nodes = r;
      },
      (e) => {
        isLoading = false;
        console.log(e);
      }
    )

  }

}
