import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, Subject } from 'rxjs';
// import { Socket } from 'ngx-socket-io'

import { io, Socket } from 'socket.io-client'


const httpOptions: any = {
  headers: new HttpHeaders({
    //'Content-Type':  'application/json',
    'Access-Control-Allow-Headers': 'Content-Type,X-Requested-With',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    'Access-Control-Allow-Origin': '*',
  }),
};

import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
const BACKEND_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class ChatService {

  socket: Socket;

  constructor(private http: HttpClient) {}
  
  getAllUsers() {
    return this.http.get<{ success: boolean; users: any[] }>(
      BACKEND_URL + 'users/all',
      { headers: httpOptions }
    );
  }

  getConversationByRoomId(roomId: string) {
    // this.socket.fromEvent('new message').pipe(map((data) => {
    //   console.log(data);
    // }))
    return this.http.get<{ success: boolean; conversation: any; users: any[] }>(
      BACKEND_URL + 'room/' + roomId
    );
  }

  getChatByRoomId(roomId: string) {
    return this.http.get<{ success: boolean; chats: any[] }>(
      BACKEND_URL + 'room/chat/' + roomId
    );
  }

  getRecentConversation() {}

  initiate(type: string, userIds: any[]) {
    const initiateData = { type: type, userIds: userIds };
    return this.http.post<{ success: boolean; chatRoom: any }>(
      BACKEND_URL + 'room/initiate',
      initiateData,
      { headers: httpOptions }
    );
  }

  sendMessage(roomId: string, messageText: string) {
    const messageData = { messageText: messageText };
    return this.http.post<{ success: boolean; post: any }>(
      BACKEND_URL + 'room/' + roomId + '/message',
      messageData
    );
  }

  // socketSub() {
  //   this.socket = io('http://localhost:3000/');
  //   let msgSubObservable: Observable<any>;
  //   this.socket.on("connect", () => {
  //     // console.log(this.socket.id);
  //     let msgSub = new Subject<any>();
  //     msgSubObservable = from(msgSub);
  //     this.socket.on("new message", (msgData: any) => {
  //       msgSub.next(msgData.message);
  //       console.log(msgData);
  //     })
  //   })
  //   return msgSubObservable;

  // }

  markConversationReadByRoomId(roomId: string) {
    return this.http.put<{ success: boolean; data: any }>(
      BACKEND_URL + 'room/' + roomId + '/mark-read',
      {}
    );
  }

  deleteRoomById(roomId) {
    return this.http.delete<{
      success: boolean;
      message: string;
      deletedRoomsCount: number;
      deletedMessagesCount: number;
    }>(BACKEND_URL + 'delete/room/' + roomId);
  }

  deleteMessageById(msgId) {
    return this.http.delete<{ success: boolean; deletedMessagesCount: number }>(
      BACKEND_URL + 'delete/message/' + msgId
    );
  }
}
