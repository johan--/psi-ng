import { Component, ViewChild, OnInit } from '@angular/core';
import { SidenavService } from './services/sidenav.service';

@Component({
  selector: 'psi-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  routerPanelDisabled: boolean = false;

  constructor(private sidenavService: SidenavService) {
    this.sidenavService.routerPanelDisabledChange.subscribe((value) => {
      this.routerPanelDisabled = value.routerPanelDisabled;
    });
  }

  ngOnInit() { }

  hideRouterPanel() {
    this.sidenavService.hidePanel();
  }

  panelDrag() {
    this.sidenavService.tellPanelSizeHasChanged();
  }

}
