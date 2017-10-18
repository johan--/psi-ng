import { Component, OnInit, Input } from '@angular/core';
import { NodeModel } from '../models/node.model';
import { TableService } from '../services/table.service';

@Component({
  selector: 'psi-table-map',
  templateUrl: './table-map.component.html',
  styleUrls: ['./table-map.component.css']
})
export class TableMapComponent implements OnInit {

  @Input() currentTable: any;
  constructor(private tableService: TableService) {
    this.tableService.mapChange.subscribe((value) => {
      this.map = value.map;
      this.geoJsons = value.geoJsons;
    });
  }

  ngOnInit() {
    // When table panel size change, update the map
    this.tableService.tablePanelSizeChange.subscribe((value) => {
      this.map.invalidateSize();
    });
  }

  // Leaflet
  private map: L.Map = this.tableService.map;
  private geoJsons: any = this.tableService.geoJsons;
  
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
      polyline: false,
      polygon: false,
      rectangle: false,
      circle: false
    }
  })

  onMapReady(map: L.Map) {
    this.tableService.mapChange.next({map: map, geoJsons: null});
    //this.map = map;
    this.map.addControl(L.control.layers(null, this.mapLayers, { position: 'topleft' }));
    this.map.addLayer(this.drawnItems);
    //this.map.addControl(this.drawControlEdit);
    //this.map.addControl(this.drawControlFull);
    this.map.on('draw:created', (e) => {
      let type: string = e['layerType']; // type = marker, polygon, ...
      let layer: L.Layer = e['layer'];
      this.drawnItems.addLayer(layer);
    })
    this.map.on('draw:deleted', (e) => {
      if(this.drawnItems.getLayers().length === 0) this.map.addControl(this.drawControlFull);
    })
  }

}
