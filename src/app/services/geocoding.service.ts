import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, URLSearchParams } from '@angular/http';

// API : https://developers.google.com/maps/documentation/geocoding/start?hl=fr

@Injectable()
export class GeocodingService {

  private googleApiKey: string = 'AIzaSyCtInGeQjPursil5gOwstTjHo9Y9Qh-jGo';
  private googleGeocodingApiUrl: string = 'https://maps.googleapis.com/maps/api/geocode/json';

  constructor(private http: Http) { }

  geocode(address: string): Observable<any> {
    if(address === null) return Observable.empty(); // Avoid sending request on form reset
    let params: URLSearchParams = new URLSearchParams();
    params.set('key', this.googleApiKey);
    params.set('address', address);
    let httpRequest = this.http.get(this.googleGeocodingApiUrl, { search: params })
      .map(res => res.json())
      .catch((e: any) => {
        return Observable.empty();
      });
    return httpRequest;
  }

  reverse(lat: number, lng: number): Observable<any> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('key', this.googleApiKey);
    params.set('latlng', `${lat},${lng}`);
    let httpRequest = this.http.get(this.googleGeocodingApiUrl, { search: params })
      .map(res => res.json())
      .catch((e: any) => {
        return Observable.empty();
      });
    return httpRequest;
  }

}
