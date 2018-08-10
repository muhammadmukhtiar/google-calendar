import { Injectable, Inject } from '@angular/core';
import { event, config } from './data.model';
declare var gapi: any;

@Injectable({
  providedIn: 'root'
})

export class ClanderService {

  /**
* The constructor for the ClanderService.
* @param config Configuration information injected into the constructor.
*/
  constructor(@Inject('config') private config: config) {
  }


  updateSigninStatus(isSignedIn) {
    console.log('isSignedIn', isSignedIn);
    return isSignedIn;
  }

  /**
   * Use to check that user is login to gmail account or not.
   * Return promise true | false
   * @author  Mukhtiar Hussain <mukhtiarfsd@gmail.com>
  */
  isLogin() {
    const status = gapi.auth2.getAuthInstance().isSignedIn.get();
    return Promise.resolve(status);
  }

  /**
   * Use to handle auth if user is not login.
   * Return promise of true | false .used to hande auth
   * @author  Mukhtiar Hussain <mukhtiarfsd@gmail.com>
  */
  handleAuth(): Promise<any> {
    //  this.initGoogle();
    gapi.auth2.getAuthInstance().signIn();
    // gapi.load('client:auth2', request);
    return gapi.client.init({
      apiKey: this.config.apiKey,
      clientId: this.config.clientId,
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
      scope: 'https://www.googleapis.com/auth/calendar'
    }).then(() => {
      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus.bind(this));
      // Handle the initial sign-in state.
      const status = this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      return Promise.resolve(status);
    });



    // var request1 = gapi.client.init({
    //   apiKey: this.config.apiKey,
    //   clientId: this.config.clientId,
    //   discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
    //   scope: 'https://www.googleapis.com/auth/calendar'
    // });

    // const status = gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus.bind(this));
    // debugger
    // return Promise.resolve(status);
    // return new Promise(resolve => {
    //   request.execute(resolve)
    // });

  }

  /**
   * Use to get Google events list Defualt limit is ten.
   * @param limit integer
   * Return promise of the response of Google clanander API 
   * @author  Mukhtiar Hussain <mukhtiarfsd@gmail.com>
  */

  getEvents(limit = 10) {
    return gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': (new Date()).toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': limit,
      'orderBy': 'startTime'
    });
  }

  /**
   * Use to create new Google Event.
  * @param event that should create type event 
  * Return promise of the response of Google clanander API 
  * @author  Mukhtiar Hussain <mukhtiarfsd@gmail.com>
  */
  createEvent(events: event): Promise<any> {
    var request = gapi.client.calendar.events.insert({
      'calendarId': 'primary',
      'resource': events
    });
    return new Promise(resolve => {
      request.execute(resolve)
    });
  }

  /**
  * Use to update Existing Google Event.
  * @param eventId should be valid google event id  
  * @param event that should be updated | type event 
  * Return promise of the response of Google clanander API 
  * @author  Mukhtiar Hussain <mukhtiarfsd@gmail.com>
  */
  updateEvent(eventId, eventData: event): Promise<any> {
    var event = gapi.client.calendar.events.get({
      "calendarId": 'primary',
      'eventId': eventId,
    });
    event.location = "New Address";
    event = {
      ...event,
      ...eventData,
    }
    var request = gapi.client.calendar.events.patch({
      'calendarId': 'primary',
      'eventId': eventId,
      'resource': event
    });

    return new Promise(resolve => {
      request.execute(resolve)
    });
  }

  /**
   * Use to Delete Google event.
  * @param eventId should be  valid google event id  
  * Return promise of the response of Google clanander API 
  * @author  Mukhtiar Hussain <mukhtiarfsd@gmail.com>
  */
  deleteEvent(eventId): Promise<any> {
    var request = gapi.client.calendar.events.delete({
      'calendarId': 'primary',
      'eventId': eventId,
    });
    return new Promise(resolve => {
      request.execute(resolve)
    });
  }

}
