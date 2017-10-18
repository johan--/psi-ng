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

  ngOnInit() {
    console.log((window.screen.height) + "px");
    console.log((window.screen.width) + "px");

  }

  hideRouterPanel() {
    this.sidenavService.hidePanel();
  }

}
