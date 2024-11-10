import { Location, TitleCasePipe } from '@angular/common';
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '../common/socket-service/chat-service.service';
import { ApiService } from '../common/api-service/api-service.service';
import { MatMenuModule } from '@angular/material/menu';

import { TooltipPosition, MatTooltipModule } from '@angular/material/tooltip';
@Component({
  selector: 'app-room',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatInputModule, MatIconModule, MatToolbarModule, TitleCasePipe, MatChipsModule, MatListModule, FormsModule, MatDialogModule, MatMenuModule, MatTooltipModule],
  templateUrl: './room.component.html',
  styleUrl: './room.component.css',
})
export class RoomComponent {
  RoomId: any;
  currentUser: any;
  toUser: any;
  toUserId: any;
  messages: Array<any> = [];
  apiService = inject(ApiService);
  constructor(
    public location: Location,
    public dialog: MatDialog,
    private router: Router,
    private chatService: ChatService,
    private activateRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef
  ) {
    activateRoute.paramMap.subscribe((param: any) => {
      this.toUserId = param.params.toUserId;
      this.RoomId = param.params.id;
      this.currentUser = this.apiService.getLocalUser();
      this.apiService.getRoomMessageList(this.RoomId).subscribe((res: any) => {
        this.messages = res
      });

      this.apiService.findUserProfile(this.toUserId).subscribe((res: any) => {
        this.toUser = res.data;
        console.log(this.toUser);
      })
    })
  }
  availableReactions = ['👍', '❤️', '😂', '😮', '😢', '🎉'];
  inputValue: any = '';
  replayText = ""

  ngOnInit() {
    this.chatService.getMessages().subscribe((message: any) => {
      this.messages.push(message)
      console.log("Message", message);
    });
    this.chatService.getReaction().subscribe((message: any) => {
      this.messages = this.messages.map((res: any) => {
        if (res._id == message.message_id) {
          res['reaction'] = message.index;
        }
        return res
      })
    });
  }
  ngOnDestroy() {
    this.chatService.leaveRoom(this.RoomId);
  }
  addreplayText(message: any) {
    console.log(message);

    this.replayText = message.message
  }
  sendMessage() {
    this.chatService.sendMessage(this.inputValue, this.RoomId, this.apiService.getLocalUser()._id, this.replayText);
    this.inputValue = '';
    this.replayText = '';
    this.scrollBottom()
  }


  addReact(index: number, message: any) {
    this.chatService.sendReaction(index, this.RoomId, message._id);
  }
  closeReplay() {
    this.replayText = ""
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.scrollBottom()
    }, 1000);
  }

  scrollBottom() {
    const list = document.getElementById(this.messages[this.messages.length - 1]._id)
    if (list) {
      list.scrollIntoView({behavior:"smooth"})
    }
  }
}
