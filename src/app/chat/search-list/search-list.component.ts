import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ApiService } from '../../common/api-service/api-service.service';
import { TitleCasePipe } from '@angular/common';
import { ChatService } from '../../common/socket-service/chat-service.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-search-list',
  standalone: true,
  imports: [ReactiveFormsModule,MatCardModule,FormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatListModule, TitleCasePipe],
  templateUrl: './search-list.component.html',
  styleUrl: './search-list.component.css'
})
export class SearchListComponent {
  searchInput = new FormControl();
  apiService = inject(ApiService);
  users:Array<any> = []
  constructor(
    private chatService: ChatService,
    private router: Router
  ){}
  ngOnInit(){
        this.searchInput.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((value: any) => {
      this.GetAllUsers(value);

    })
  }
  GetAllUsers(value: any) {
    this.apiService.GetAllUsers(value).subscribe((users: any) => {
      this.users = users.data
    })
  }
  goToRoom(_id:any){
    const localUser = this.apiService.getLocalUser()
    this.apiService.GetRoom([_id, localUser._id]).subscribe((res: any) => {
      const roomId = res.data.roomId;
      this.chatService.joinRoom(roomId);
      this.router.navigate([`chat-room/${roomId}`, { 'toUserId': _id }])
    })
  }
}
