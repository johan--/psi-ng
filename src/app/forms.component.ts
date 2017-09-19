import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NodeService } from './services/node.service';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'psi-node-registerr',
  templateUrl: './add-node-form.component.html'
})
export class AddNodeFormComponent {
	nodeForm: FormGroup;
	nodesResult: Object;

  constructor(fb: FormBuilder, private nodesService: NodeService) {
		this.nodeForm = fb.group({
			node: ''
		});
		this.nodeForm.valueChanges
			.debounceTime(400)
			.distinctUntilChanged()
			.subscribe((term: string) => {
				console.log(term);
				this.ngOnDestroy();
				this.nodesService.findSpecies(term["node"])
					.subscribe(response => {
						console.log(response);
						this.nodesResult = response;
					}, (err: Error) => {
						console.log(err);
					});
			}, (err: Error) => {
				console.log(err);
			}
			);
	}

	ngOnDestroy() {
		console.log('destroy');
	}

	register() {
	  console.log(this.nodeForm.value);
	} 
}