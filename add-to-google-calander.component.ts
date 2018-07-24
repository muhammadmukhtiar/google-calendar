import { Component, OnInit, Pipe, PipeTransform, NgZone, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ClanderService } from './clander-service.service';
import { event } from 'app/sharedModules/add-to-google-calander/data.model';

declare var gapi: any;

@Component({
  selector: 'add-to-google-calander',
  templateUrl: './add-to-google-calander.component.html',
  styleUrls: ['./add-to-google-calander.component.scss']
})
export class AddToGoogleCalanderComponent implements OnInit {

  @Input() events: event;
  @Input() cssClass: string;
  @Input() label: string;
  @Output() response = new EventEmitter();
  sentInitOverlay = false;
  loginstatus = false;
  apiKey: string;
  clientId: string;


  constructor(
    private calanderSVC: ClanderService
  ) {

    if (this.calanderSVC['config']) {
      this.apiKey = this.calanderSVC['config'].apiKey;
      this.clientId = this.calanderSVC['config'].clientId;
    }

  }

  ngOnInit() {
    setTimeout(() => this.initGoogle(), 500);
  }

  closePopup() {
    this.sentInitOverlay = false;
    this.onPopup('close');
  }


  check(status) {
    console.log('statusstatus', status);
    this.loginstatus = status;
  }

  createCalanderEvent() {
    this.check((gapi.auth2.getAuthInstance().isSignedIn.get()));
    if (!this.loginstatus) {
      this.initClient();
      this.handleAuthClick();
    } else {
      this.initClient();
    }

  }

  initGoogle() {
    // Initialize the client with API key and People API, and initialize OAuth with an
    // OAuth 2.0 client ID and scopes (space delimited string) to request access.
    gapi.load('client:auth2', () => {
      gapi.client.init({
        apiKey: this.apiKey,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        clientId: this.clientId,
        scope: 'https://www.googleapis.com/auth/calendar'
      }).then(() => {
        // Listen for sign-in state changes.
        //  gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus.bind(this));
        // Handle the initial sign-in state.
        //   this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      });


    });
  }

  initClient() {
    // Initialize the client with API key and People API, and initialize OAuth with an
    // OAuth 2.0 client ID and scopes (space delimited string) to request access.
    gapi.load('client:auth2', () => {
      gapi.client.init({
        apiKey: this.apiKey,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        clientId: this.clientId,
        scope: 'https://www.googleapis.com/auth/calendar'
      }).then(() => {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus.bind(this));
        // Handle the initial sign-in state.
        this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      });
    });
  }


  handleClientLoad() {
    gapi.load('client:auth2', this.initGoogle);
  }

  updateSigninStatus(isSignedIn) {
    console.log('isSignedIn', isSignedIn);
    // When signin status changes, this function is called.
    // If the signin status is changed to signedIn, we make an API call.
    if (isSignedIn) {
      console.log('isSignedIn', isSignedIn);
      this.createEvent();
    } else {
      console.log('isSignedIn', isSignedIn);
    }
  }

  /**
    *  Sign in the user upon button click.
    */
  handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
  }

  createEvent() {
    var request = gapi.client.calendar.events.insert({
      'calendarId': 'primary',
      'resource': this.events
    });
    request.execute((event) => {
      console.log('Event created: ' + event.htmlLink);
      this.response.emit(event);
    });
  }

  onPopup(status) {
    if (status == 'opened') {
      (<HTMLElement>document.querySelector('main')).style.overflow = 'hidden';
      (<HTMLElement>document.querySelector('main')).scrollTop = 0;
    } else (<HTMLElement>document.querySelector('main')).style.overflow = 'auto';
  }

}
