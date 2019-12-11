import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Search } from '../../models/Search';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Restaurant } from 'src/app/models/Restaurant';
import { shareReplay } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class SearchService {

  // url to access get back data from google api
  private url: string = `/api/google/place/v2/`;
  private detailsUrl: string = `/api/google/place/restaurantdetails/`;
  private autocompleteUrl: string = '/api/google/place/autocomplete/';

  public restaurantSource = new BehaviorSubject([]);
  public restaurants = this.restaurantSource.asObservable();
  public currentRestaurantId = new BehaviorSubject("");

  public currentRestaurantSource: BehaviorSubject<Restaurant> = new BehaviorSubject({
    id: "",
    name: "",
    address: "",
    phoneNumber: "",
    openingHour: "",
    openNow: null,
    priceLevel: 1,
    websiteUrl: "",
    mapUrl: "",
    latitude: "",
    longitude: ""
  });

  public currentRestaurant = this.currentRestaurantSource.asObservable;

  private restaurantCalls: any = {};
  private restaurantDetails: any = {};


  constructor(private http: HttpClient) { }

  // gets user input from search bar and uses the google api to search for restaurants
  getRestaurants(input: string): Observable<Search[]> {

    let searchInput = new HttpParams().set('searchInput', input);
    console.log(this.url + input);
    return this.http.get<Search[]>(`${this.url}`, { params: searchInput });

  }

  getRestaurantDetails(restaurantId: string): Observable<Restaurant> {

    if (!this.restaurantDetails[restaurantId]) {
      this.restaurantDetails[restaurantId] = this.http.get<Restaurant>(`${this.detailsUrl}${restaurantId}`).pipe(
        shareReplay(1)
      );

    }

    return this.restaurantDetails[restaurantId];

  }


  restaurantApiInfo(searchInput: string) {

    if (!this.restaurantCalls[searchInput]) {
      this.restaurantCalls[searchInput] = this.getRestaurants(searchInput).pipe(

        shareReplay(1)
      );

      console.log(this.restaurantCalls);
    }

    console.log(this.restaurantCalls);
    return this.restaurantCalls[searchInput];
  };


  autocompleteRestaurants(searchTerm: string) {
    console.log(searchTerm);

    return this.http.get(`${this.autocompleteUrl}${searchTerm}`)

  };

}
