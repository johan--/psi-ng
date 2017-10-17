import { Component, OnInit } from '@angular/core';
import { SidenavService } from '../services/sidenav.service';

@Component({
  selector: 'psi-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(private sidenavService: SidenavService) { }

  ngOnInit() {
  }

  showRouterPanel() {
    this.sidenavService.showPanel();
  }

  hideRouterPanel() {
    this.sidenavService.hidePanel();
  }
}
