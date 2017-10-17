import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { MdSidenav } from '@angular/material';

@Injectable()
export class SidenavService {

  public sideNav: MdSidenav;

  public routerPanelDisabled: boolean = false;
  public routerPanelDisabledChange: Subject<{routerPanelDisabled: boolean}> = new Subject<{routerPanelDisabled: boolean}>();

  constructor() {
    this.routerPanelDisabledChange.subscribe((value) => {
      this.routerPanelDisabled = value.routerPanelDisabled;
    });

    }

  showPanel() {
    this.routerPanelDisabledChange.next({routerPanelDisabled: true});
  }

  hidePanel() {
    this.routerPanelDisabledChange.next({routerPanelDisabled: false});
  }

}
