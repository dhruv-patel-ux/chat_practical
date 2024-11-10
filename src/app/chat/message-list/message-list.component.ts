import { TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from '../../common/api-service/api-service.service';
import { ChatService } from '../../common/socket-service/chat-service.service';
@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [
    MatCardModule, MatButtonModule, MatInputModule, MatIconModule, MatToolbarModule, TitleCasePipe, MatDividerModule, MatListModule, RouterLink, MatMenuModule, ReactiveFormsModule, RouterOutlet
  ],
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})
export class MessageListComponent {
  apiService = inject(ApiService);
  messages: string[] = [];
  constructor(
    private router: Router,
    private chatService: ChatService
  ) {
    // this.apiService.GetAllRoom(this.apiService.getLocalUser()._id);
    this.chatService.getFriends();
  }
  goToRoom(id: any, roomId?: any) {
    if (roomId) {
      this.chatService.joinRoom(roomId);
      this.router.navigate([`chat-room/${roomId}`, { 'toUserId': id }])
    } else {
      const localUser = this.apiService.getLocalUser()
      this.apiService.GetRoom([id, localUser._id]).subscribe((res: any) => {
        const roomId = res.data.roomId;
        this.chatService.joinRoom(roomId);
        this.router.navigate([`chat-room/${roomId}`, { 'toUserId': id }])
      })
    }
  }
}
