import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUrl = 'http://localhost:3000'
  constructor(private http: HttpClient) { }
  getRooms() {
    return this.http.get(this.baseUrl + '/Users')
  }
  getmessage(room:any) {
    return this.http.get(this.baseUrl + '/messages')
  }
}
