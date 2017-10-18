import { Component, OnInit, Injectable, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operator/map';
import { debounceTime } from 'rxjs/operator/debounceTime';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/empty';
import { distinctUntilChanged } from 'rxjs/operator/distinctUntilChanged';
import { of } from 'rxjs/observable/of';
import { switchMap } from 'rxjs/operator/switchMap';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { NodeModel } from '../models/node.model';
import { ValidationComponent } from '../validation/validation.component';
import { NodeComponent } from '../node/node.component';
import { NodeService } from '../services/node.service';
import { TableService} from '../services/table.service';
import { GeocodingService } from '../services/geocoding.service';
import { SidenavService } from '../services/sidenav.service';
import { ApiTransformerService as apiTS } from '../services/api-transformer.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MdButtonModule, MdSelectModule, MdCardModule, MdInputContainer } from '@angular/material';
import { bfPipe } from '../pipes/bfPipe';
import { slideToLeft } from '../animations/anim';
import { NotificationsService } from 'angular2-notifications';
import { AlgoliaService } from '../services/algolia.service';

let searchResults: any = [];

@Component({
  selector: 'psi-node-register',
  templateUrl: './node-register.component.html',
  styleUrls: ['./node-register.component.css'],
  animations: [slideToLeft],
  host: { '[@slideToLeft]': '' }
})
export class NodeRegisterComponent implements OnInit {

  nodeForm: FormGroup;
  titre: FormControl;
  repository: FormControl;
  repositoryIdTaxo: FormControl;
  repositoryIdNomen: FormControl;
  level: FormControl;
  name: FormControl;
  nodes: FormArray;
  inputName: FormControl;
  validatedName: FormControl;
  geoJson: FormControl;
  isLoading: FormControl;

  // Syntaxon validation inputs & variables
  validatedSyntaxon: any = null;
  validatedSyntaxonInput: string= '';
  validatedSyntaxonFormGroup = new FormGroup({
    validatedSyntaxonRepository: new FormControl('',),
    validatedSyntaxonInputName: new FormControl('',),
    validatedSyntaxonIdTaxo: new FormControl('',),
    validatedSyntaxonIdNomen: new FormControl('',),
    validatedSyntaxonValidatedName: new FormControl('',)
  });

  mapSearchInput: FormControl;
  mapSearchResults: any;

  // ALGOLIA Search box connection
  ngAfterViewInit() {
    this.algoliaService.basevegSearch.start();
  }
  
  // Leaflet
  private map: L.Map;
  public mapLat = 0;
  public mapLng = 0;
  private mapPositionPoint = L.point(this.mapLat, this.mapLng);

  private osmLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: 'Open Street map' });
  private googleSatelliteLayer = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{ maxZoom: 20, subdomains:['mt0','mt1','mt2','mt3'], attribution: 'Google maps' });
  private googleHybridLayer = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{ maxZoom: 20, subdomains:['mt0','mt1','mt2','mt3'], attribution: 'Google maps' });
  private brgmLayer = L.tileLayer.wms('http://geoservices.brgm.fr/geologie', { version: '1.3.0', layers: 'Geologie'});
  private mapLayers = {
    'Google': this.googleHybridLayer,
    'OSM': this.osmLayer,
    'BRGM': this.brgmLayer
  }

  options = {
    layers: [
      this.osmLayer,
      //this.googleSatelliteLayer,
      this.googleHybridLayer
    ],
    zoom: 4,
    center: L.latLng({ lat: 46.55886030311719, lng: 2.9882812500000004 })
  };

  drawnItems = new L.FeatureGroup();
  drawnFinalItem = new L.Layer();
  drawControlEdit = new L.Control.Draw({
    position: 'topright',
    draw: false,
    edit: {
      featureGroup: this.drawnItems
    }
  })
  drawControlFull = new L.Control.Draw({
    position: 'topright',
    draw: {
      marker: {
        icon: L.icon({
          iconUrl: './assets/img/map/marker-icon.png',
          shadowUrl: './assets/img/map/marker-shadow.png'
        })
      },
      polyline: true,
      polygon: true,
      rectangle: false,
      circle: false
    }
  })

  onMapReady(map: L.Map) {
    this.map = map;
    this.map.addControl(L.control.layers(null, this.mapLayers, { position: 'topleft' }));
    this.map.addLayer(this.drawnItems);
    this.map.addControl(this.drawControlEdit);
    this.map.addControl(this.drawControlFull);
    this.map.on('draw:created', (e) => {
      let type: string = e['layerType']; // type = marker, polygon, ...
      let layer: L.Layer = e['layer'];
      this.drawnItems.addLayer(layer);
      this.nodeForm.controls['geoJson'].patchValue(this.drawnItems.toGeoJSON());
      if(this.drawnItems.getLayers().length > 0) this.map.removeControl(this.drawControlFull);
      if(this.drawnItems.getLayers().length === 1) this.drawnFinalItem = this.drawnItems.getLayers()[0];
    })
    this.map.on('draw:deleted', (e) => {
      if(this.drawnItems.getLayers().length === 0) this.map.addControl(this.drawControlFull);
    })
console.log(this.mapLayers);    
    /*this.map.on('move', (ev) => { 
      let pos = this.map.getCenter();
      this.mapLat = pos.lat;
      this.mapLng = pos.lng;
    });

    this.map.on('click', (ev) => { 
      let pos = this.map.getCenter();
      this.mapLat = pos.lat;
      this.mapLng = pos.lng;
    });*/
    
  }
  // End Leaflet

  constructor(private fb: FormBuilder, private nodeService: NodeService, private tableService: TableService, private apiTS: apiTS, private geocodingService: GeocodingService, private notificationsService: NotificationsService, private router: Router, private algoliaService: AlgoliaService, private sidenavService: SidenavService) { }

  ngOnInit() {
    // Create Form Group
    this.nodeForm = this.fb.group({
      frontId: Date.now()-1,
      mapSearchInput: '',
      geoJson: '',
      nodes: this.fb.array([ this.createNodeItem() ]),
      validation: this.validatedSyntaxonFormGroup
    });

    // Map search & geocode
    this.nodeForm.controls.mapSearchInput.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .switchMap((value: string) => this.geocodingService.geocode(value))
      .subscribe(
        (r) => {
          this.mapSearchResults = r.results; // r = header + results
        },
        (e) => console.log('error')
      )

      // Listen on router panel size change
      // On change, redraw the map
      this.sidenavService.panelSizeChange.subscribe((value) => {
        this.redrawMap();
      });
  }

  mapResultClick(item) {
    this.mapLat = item.geometry.location.lat;
    this.mapLng = item.geometry.location.lng;
    let topLeftLat: number = item.geometry.viewport.northeast.lat;
    let topLeftLng: number = item.geometry.viewport.northeast.lng;
    let topLeft = L.latLng(topLeftLat, topLeftLng);
    let bottomRightLat: number = item.geometry.viewport.southwest.lat;
    let bottomRightLng: number = item.geometry.viewport.southwest.lng;
    let bottomRight = L.latLng(bottomRightLat, bottomRightLng);
    let bounds = L.latLngBounds(bottomRight, topLeft);
    this.map.flyTo(L.latLng(this.mapLat, this.mapLng));
    this.map.fitBounds(bounds);
    this.mapSearchResults = null;
  }

  // When the map parent's div size change (eg. panel width), have to redraw the map
  redrawMap() {
    this.map.invalidateSize();
  }

  // Validation
  static isInputNodeValid(control: FormControl) {
    if(control.dirty && control.touched) {
      return {valid: true};
    }
    return null;
  }

  // Keypress
  onCoefTabKey(event, nodeIndex) {
    this.nodes = this.nodeForm.controls.nodes as FormArray;

    if(this.nodes.at(nodeIndex).valid) {
      console.log(`the node ${nodeIndex} is valid`);
      this.addItem();
    } else {
      console.log(`the node ${nodeIndex} is NOT valid`);
      //console.log(this.nodeForm.value.nodes);
    }
  }

  createNodeItem(): FormGroup {

    // Create Form Group
    let fg = this.fb.group({
      frontId: Date.now(),
      repositoryIdTaxo: this.fb.control('',),
      repositoryIdNomen: this.fb.control('',),
      inputName: this.fb.control('',),
      validatedName: this.fb.control('',),
      name: this.fb.control('', [Validators.required]),
      coef: this.fb.control('', [Validators.required]),
      searchResults: [],
      isLoading: false
    });
          
    // Take care of value change (name)
    fg.get('name').valueChanges
      .debounceTime(400)
      .do(() => fg.value.isLoading = true)
      .distinctUntilChanged()
      .switchMap((value) => this.nodeService.findSpecies(value))
      .subscribe(
        (r) => {
          fg.value.isLoading = false;
          fg.get('searchResults').setValue(r);
        },
        (e) => {
          fg.value.isLoading = false;
          fg.get('searchResults').setValue('');
          console.log(e);
        }
      )
    return fg;
  }

  addItem(): void {
    this.nodes = this.nodeForm.get('nodes') as FormArray;
    this.nodes.push(this.createNodeItem());
  }

  resetItem(node: FormGroup): void {
    node.reset();
  }

  deleteItem(i: number): void {
    this.nodes.removeAt(i);
  }

  register() {
    this.validatedSyntaxonFormGroup.patchValue({validatedSyntaxonInputName: this.validatedSyntaxonInput});
    this.validatedSyntaxonFormGroup.patchValue({validatedSyntaxonIdNomen: this.validatedSyntaxon.id});
    this.validatedSyntaxonFormGroup.patchValue({validatedSyntaxonIdTaxo: this.validatedSyntaxon.catminatCode});
    this.validatedSyntaxonFormGroup.patchValue({validatedSyntaxonRepository: 'baseveg'});
    this.validatedSyntaxonFormGroup.patchValue({validatedSyntaxonValidatedName: this.validatedSyntaxon.syntaxon});

    this.nodeService.register(this.nodeForm.value)
    .subscribe(
      (response) => {
        this.notificationsService.success('', 'Votre relevé a bien été enregistré');
        // reset the form
        let nodesNow: FormArray = this.nodeForm.value.nodes;
        this.nodeForm.reset();
        for (var index = 1; index < nodesNow.length; index++) { // index = 1 : we keep 1 node
          this.nodes.removeAt(index);
        }
      },
      () => console.log('error')
    );
  }

  registerAndAddToCurrentTable() {
    this.nodeService.register(this.nodeForm.value)
    .subscribe(
      (response) => {
        this.notificationsService.success('Votre relevé a bien été enregistré');
        this.tableService.pushNodesOnTable([response], this.tableService.getCurrentTable());
        this.tableService.markCurrentTableHasChanged();
console.log(response);
//console.log(this.tableService.getCurrentTable());
        // redirect to table
        this.router.navigate(['/']);
      },
      () => console.log('error')
    );
  }

  updateSearchResults(term, index): void {
    this.nodes = this.nodeForm.get('nodes') as FormArray;
  }

  selectedResult(node: FormGroup, resultIndex, rootNodeChildIndex): void {
    node.patchValue({repositoryIdTaxo: node.value.searchResults[resultIndex].bdnff_taxin_id});
    node.patchValue({repositoryIdNomen: node.value.searchResults[resultIndex].bdnff_nomen_id});
    node.patchValue({inputName: node.value.name});
    node.patchValue({validatedName: this.apiTS.baseflorToTypeahead(node.value.searchResults)[resultIndex]});
    node.patchValue({searchResults: []});
  }

  selectedValidSyntaxon(node: NodeModel) {
    this.validatedSyntaxon = node;
  }

  selectedValidSyntaxonInput(query: string) {
    this.validatedSyntaxonInput = query;
  }

}
