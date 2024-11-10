import { Injectable, inject, signal } from '@angular/core';
import io from 'socket.io-client';
import { Observable } from 'rxjs';
import { ApiService } from '../api-service/api-service.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: any
  private apiService = inject(ApiService)
  isCall = signal(false)
  constructor() {
    let token = localStorage.getItem('ACCESS_TOKEN');
    this.socket = io(`http://localhost:9999?authorization=${token}&userId=${this.user._id}`,
      {
        transports: ['websocket'],
        extraHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
  }

  getUsers() {
    let observable = new Observable<{ user: String, message: String }>(observer => {
      this.socket.on('live-users', (data: any) => {
        observer.next(data);
      });
      return () => { this.socket.disconnect(); };
    });
    return observable;
  }

  sendMessage(message: any, roomId: any, userId: any,replay?:string) {
    this.socket.emit('message', { message, roomId, userId,replay });
  }

  getMessages() {
    let observable = new Observable<{ user: String, message: String }>(observer => {
      this.socket.on('message', (data: any) => {
        observer.next(data);
      });
      return () => { this.socket.disconnect(); };
    });
    return observable;
  }

  sendReaction(index: any, roomId: any, message_id: any) {
    this.socket.emit('react', { index, roomId, message_id });
  }

  getReaction() {
    let observable = new Observable<any>(observer => {
      this.socket.on('react', (data: any) => {
        console.log("response ------",data);
        
        observer.next(data);
      });
      return () => { this.socket.disconnect(); };
    });
    return observable;
  }
  getFriends() {
    this.socket.emit('friend-list', this.user._id);
    this.socket.on('friend-list', (friends: any) => {
      this.apiService.friendList.set(friends)
    })
  }
  user = this.apiService.getLocalUser();
  joinRoom(roomId: any) {
    this.socket.emit('joinRoom', { roomId, userId: this.user._id });
    return
  }
  leaveRoom(roomId: any) {
    this.socket.emit('leaveRoom', { roomId, userId: this.user._id });
  }

  joinVideoCall(userId: any, appId: any, channel: any, token: any) {
    this.socket.emit('joinVideoCall', { userId, appId, channel, token });
    this.socket.on('getVideoCall', (videoData: any) => {
      console.log("Call Recive -----", videoData);

    })

  }
  getVideoCall() {
    this.socket.on('getVideoCall', (videoData: any) => {
      console.log("Call Recive -----", videoData);
      this.isCall.set(true)
      // return videoData 
    })

  }
}

