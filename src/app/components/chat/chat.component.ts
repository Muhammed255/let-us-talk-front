import { Component, OnInit, HostListener, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
// import { Socket } from 'ngx-socket-io';
import { AuthService } from '../auth/auth.service';
import { ChatService } from './chat.service';

import { map } from 'rxjs/operators';

import { io, Socket } from 'socket.io-client'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('sidenav') sidenav: any;
  public userImage = 'assets/img/app/user.jpg';
  public chats: Array<any>;
  public users: Array<any>;
  public chatUsers: Array<any>;
  public talks: Array<any>;
  public sidenavOpen: boolean = true;
  public currentChat: any;
  public newMessage: string;
  public roomId: string;
  public authUserId = localStorage.getItem('userId');

  socket: Socket;

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;


  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    // private socket: Socket
  ) {}

  ngOnInit() {
    this.getUsers();
    // this.chatService.connect();
    this.socket = io('http://localhost:3000/');
    this.socket.on("connect", () => {
      
      this.socket.on("new message", data => {
        this.talks.push(data.message);
      })

    })
    // this.chatService.socketInit();
    if (window.innerWidth <= 768) {
      this.sidenavOpen = false;
    }
    this.scrollToBottom();
  }

  getUsers() {
    this.chatService.getAllUsers().subscribe((res) => {
      if (res.success) {
        this.users = res.users;
      }
    });
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    window.innerWidth <= 768
      ? (this.sidenavOpen = false)
      : (this.sidenavOpen = true);
  }

  public getChat(obj) {
    if (this.talks) {
      this.talks.length = 2;
    }
    // initiate chat
    this.chatService
      .initiate(localStorage.getItem('type') + '-to-' + obj.type, [
        localStorage.getItem('userId'),
        obj._id,
      ])
      .subscribe((response) => {
        if (response.success) {
          this.roomId = response.chatRoom.chatRoomId;
          // this.socket.emit("subscribe", {room: this.roomId, otherUserId: localStorage.getItem("userId")})
          this.chatService
            .getConversationByRoomId(response.chatRoom.chatRoomId)
            .subscribe((result) => {
              if (result.success) {
                this.chatUsers = result.users;
                this.talks = result.conversation;
                this.currentChat = obj;
                this.chatService
                  .markConversationReadByRoomId(response.chatRoom.chatRoomId)
                  .subscribe((con) => {
                    if (con.success) {
                      console.log(con.data);
                    }
                  });
                // console.log('conversation: ', result.conversation)
                // console.log('users: ', result.users)
              }
            });
        }
      });
      if (window.innerWidth <= 768) {
        this.sidenav.close();
      }
  }

  
    ngAfterViewChecked() {        
        this.scrollToBottom();        
    } 

    onDeleteRoom() {
      this.chatService.deleteRoomById(this.roomId).subscribe(res => {
        if(res.success) {
          console.log("room", res.deletedRoomsCount);
          console.log("message", res.deletedMessagesCount);
          this.getUsers();
        }
      })
    }

    onDeleteMessgae(msgId) {
      this.chatService.deleteMessageById(msgId).subscribe(res => {
        if(res.success) {
          console.log(res.deletedMessagesCount);
          const index = this.talks.map(c => {return c._id}).indexOf(msgId);
          this.talks.splice(index, 1);
        }
      })
    }

    scrollToBottom(): void {
      try {
          this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      } catch(err) { }                 
  }

  public sendMessage($event) {
    if (
      ($event.which === 1 || $event.which === 13) &&
      this.newMessage.trim() != ''
    ) {
      if (this.talks) {
        this.chatService
          .sendMessage(this.roomId, this.newMessage)
          .subscribe((res) => {
            if (res.success) {
              this.newMessage = '';
              let chatContainer = document.querySelector('.chat-content');
              if (chatContainer) {
                setTimeout(() => {
                  var nodes = chatContainer.querySelectorAll('.mat-list-item');
                  let newChatTextHeight = nodes[nodes.length - 1];
                  chatContainer.scrollTop =
                    chatContainer.scrollHeight + newChatTextHeight.clientHeight;
                });
              }
            }
          });
      }
    }
  }
}
