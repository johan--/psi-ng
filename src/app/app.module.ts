import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ROUTES } from './app.routes';

import { AppComponent } from './app.component';
import { NodeComponent } from './node/node.component';
import { AddNodeFormComponent } from './forms.component';
import { NodeService } from './services/node.service';
import { TableService } from './services/table.service';
import { GeocodingService } from './services/geocoding.service';
import { ApiTransformerService } from './services/api-transformer.service';
import { NodeTypeAheadComponent } from './node-type-ahead/node-type-ahead.component';
import { NodeRegisterComponent } from './node-register/node-register.component';
import { MenuComponent } from './menu/menu.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InputSimpleSearchComponent } from './input-simple-search/input-simple-search.component';
import { ValidationComponent } from './validation/validation.component';
import { Ng2CompleterModule } from "ng2-completer";
import { bfPipe } from './pipes/bfPipe';
import { NodeSearchComponent } from './node-search/node-search.component';
import { LeafletModule } from '@asymmetrik/angular2-leaflet';
import { LeafletDrawModule } from '@asymmetrik/angular2-leaflet-draw';
import { HotTableModule } from 'ng2-handsontable';
import { TableComponent } from './table/table.component';
import { TableMapComponent } from './table-map/table-map.component';
import { TableSpreadsheetComponent } from './table-spreadsheet/table-spreadsheet.component';
import { TableSearchComponent } from './table-search/table-search.component';
//import { camelcaseKeys } from 'camelcase-keys';

@NgModule({
  declarations: [
    AppComponent,
    NodeComponent,
    AddNodeFormComponent,
    NodeTypeAheadComponent,
    NodeRegisterComponent,
    MenuComponent,
    InputSimpleSearchComponent,
    ValidationComponent,
    bfPipe,
    NodeSearchComponent,
    TableComponent,
    TableMapComponent,
    TableSpreadsheetComponent,
    TableSearchComponent
  ],
  imports: [
    BrowserModule,
    Ng2CompleterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES),
    NgbModule.forRoot(),
    BrowserAnimationsModule,
    MaterialModule,
    LeafletModule,
    LeafletDrawModule,
    HotTableModule
  ],
  providers: [NodeService, TableService, GeocodingService, ApiTransformerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
