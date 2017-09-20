import { Component, OnInit } from '@angular/core';
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'psi-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  constructor(private notificationsService: NotificationsService) { }

  options = {
    position: ["bottom", "right"],
    timeOut: 5000,
    animate: "fromRight",
    showProgressBar: false,
  };

  ngOnInit() {
  }

}
