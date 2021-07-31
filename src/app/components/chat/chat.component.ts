import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @ViewChild('sidenav') sidenav: any;
  public userImage = 'assets/img/app/user.jpg';
  public chats: Array<any>;
  public users: Array<any>;
  public chatUsers: Array<any>;
  public talks: Array<any>;
  public sidenavOpen:boolean = true;
  public currentChat:any;
  public newMessage:string;
  public roomId:string;
  public authUserId = localStorage.getItem("userId");

  constructor(private chatService: ChatService, private authService: AuthService) {}

  ngOnInit() {
    this.chatService.getAllUsers().subscribe(res => {
      if(res.success) {
        this.users = res.users;
      }
    })
    if(window.innerWidth <= 768){
      this.sidenavOpen = false;
    }    
  } 

  @HostListener('window:resize')
  public onWindowResize():void {
    (window.innerWidth <= 768) ? this.sidenavOpen = false : this.sidenavOpen = true;
  }

  checkAuthUserId(arr) {
    return arr.some(u => u._id === this.authUserId);
  }

  public getChat(obj){
    // initiate chat first
    if(this.talks){
       this.talks.length = 2;
    }   
    this.chatService.initiate(localStorage.getItem("type") + "-to-" + obj.type, [localStorage.getItem("userId"), obj._id]).subscribe(response => {
      if(response.success) {
        this.roomId = response.chatRoom.chatRoomId;
        this.chatService.getConversationByRoomId(response.chatRoom.chatRoomId).subscribe(result => {
          if(result.success) {
            this.chatUsers = result.users;
            console.log(result.conversation)
            this.talks = result.conversation;
            this.talks.push(obj);
            this.currentChat = obj;
            if(window.innerWidth <= 768){
                this.sidenav.close();
              } 
            // console.log('conversation: ', result.conversation)
            // console.log('users: ', result.users)
          }
        })
      }
    })
  }

  public sendMessage($event) {       
    if (($event.which === 1 || $event.which === 13) && this.newMessage.trim() != '') {
      if(this.talks){ 
        this.chatService.sendMessage(this.roomId, this.newMessage).subscribe(res => {
          if(res.success) {
            console.log(res.post)
            this.talks.push(
              {messageText: this.newMessage}
            )
            this.newMessage = '';
            let chatContainer = document.querySelector('.chat-content');
            if(chatContainer){
              setTimeout(() => {
                var nodes = chatContainer.querySelectorAll('.mat-list-item');
                let newChatTextHeight = nodes[nodes.length- 1];
                chatContainer.scrollTop = chatContainer.scrollHeight + newChatTextHeight.clientHeight;
              }); 
            }
          }
        })
      }
    }
  }

  public ngOnDestroy(){
    if(this.talks)
      this.talks.length = 2;
  }

}