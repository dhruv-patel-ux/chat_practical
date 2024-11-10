import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  base_url = "http://localhost:9999/api/v1";
  profile_photo = signal<any>('');
  friendList = signal<any>('')
  constructor(
    private http: HttpClient
  ) { }

  validatToken(token:any){
    return this.http.post(this.base_url+'/auth/validate-token',{token})
  }
  getLocalUser(){
    const localUser = localStorage.getItem("USER");
    return localUser && JSON.parse(localUser);
  }
  getLocalImage(){
    return localStorage.getItem('profile-image');
  }
  logout(){
    localStorage.setItem('USER', '');
    localStorage.setItem('ACCESS_TOKEN', '');
    return
  }
  signup(data: any): Observable<any> {
    return this.http.post(`${this.base_url}/users/sign-up`, data)
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.base_url}/auth/login`, data)
  }

  updateProfile(data: any) {
    return this.http.patch(`${this.base_url}/users/update-profile-photo`, data)
  }
  findUserProfile(id:any){
    return this.http.get(`${this.base_url}/users/find-user-profile/${id}`);
  }
  GetAllUsers(SearchTerm?: any) {
    return this.http.get(`${this.base_url}/users?SearchTerm=${SearchTerm}`)
  }

  GetRoom(data: any){
    return this.http.post(`${this.base_url}/rooms`,data)
  }

  GetAllRoom(userId: any){
    this.http.get(`${this.base_url}/rooms?userId=${userId}`).subscribe((res:any)=>{
      this.friendList.set(res);
    })
  }
  getRoomMessageList(roomId: any){
    return this.http.get(`${this.base_url}/room-chat/${roomId}`)
  }

}
