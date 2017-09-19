import { Component, ViewChild, OnInit } from '@angular/core';
import { MdSidenav } from '@angular/material';
import { SidenavService } from './services/sidenav.service';

@Component({
  selector: 'psi-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  @ViewChild('sidenav') public sideNav: MdSidenav;

  constructor(private sidenavService: SidenavService) { }

  ngOnInit() {
    this.sidenavService.sideNav = this.sideNav;
  }

  closeSidenav() {
    this.sidenavService.sideNav.close();
  }

}
