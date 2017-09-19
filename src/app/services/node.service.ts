import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import { of } from 'rxjs/observable/of';
import { NodeModel } from '../models/node.model';

@Injectable()
export class NodeService {

  private nodesUrl = 'http://psing/app_dev.php/api/nodes';  // URL to web API
  private nodeSearchTermUrl = 'http://psing/app_dev.php/api/nodes/';
  private baseflorUrl = 'http://localhost/eveg/web/app_dev.php/api/baseflor/species/term/';  // URL to web API

  constructor(private http: Http) { }

  listNodes(): Observable<any> {
    let httpRequest = this.http.get(this.nodesUrl)
    .map(res => res.json() as NodeModel)
    .catch((e) => {
      return Observable.empty();
    });
    return httpRequest;
  }

  findSpecies(term: string): Observable<any> {
    if(term === null) return Observable.empty(); // Avoid sending request on form reset
    let httpRequest = this.http.get(this.baseflorUrl+term)
    .map(res => res.status == 200 ? res.json() : of.call('') )
    .catch((e) => {
      return Observable.empty();
    });
    return httpRequest;
  }

  findNodesByTerm(term: string): Observable<any> {
    if(term === null) return Observable.empty();
    let httpRequest = this.http.get(this.nodeSearchTermUrl+term)
    .map(res => res.status == 200 ? res.json() : of.call('') )
    .catch((e) => {
      return Observable.empty();
    });
    return httpRequest;
  }

  register(data): Observable<any> {
    let httpRequest = this.http.put(this.nodesUrl, JSON.stringify(data))
      .map(res => res.json() as NodeModel)
      .catch((e: any) => {
        return Observable.empty();
      });
    return httpRequest;
  }

}