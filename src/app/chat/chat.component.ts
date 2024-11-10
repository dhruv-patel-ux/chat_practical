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
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ApiService } from '../common/api-service/api-service.service';
import { ChatService } from '../common/socket-service/chat-service.service';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    MatCardModule, MatButtonModule, MatInputModule, MatIconModule, MatToolbarModule, TitleCasePipe, MatDividerModule, MatListModule, RouterLink, RouterLinkActive, MatMenuModule, ReactiveFormsModule, RouterOutlet, MatDialogModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {

  apiService = inject(ApiService);
  stories: Array<any> = [];
  message: string | undefined;
  messages: string[] = [];
  readonly dialog = inject(MatDialog);
  constructor(
    private router: Router,
    public chatService: ChatService
  ) {
    const data = this.chatService.getVideoCall()
    console.log(data);
    this.chatService.getFriends()
  }
  ngOnInit() {

    this.apiService.profile_photo.set(this.apiService.getLocalImage())

  }
  logout() {
    this.apiService.logout()
    this.router.navigate(['login'])
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
