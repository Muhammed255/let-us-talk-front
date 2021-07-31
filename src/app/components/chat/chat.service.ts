import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';





import { environment } from 'src/environments/environment';
const BACKEND_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }

  getAllUsers() {
    return this.http.get<{success: boolean, users: any[]}>(BACKEND_URL + "users/all")
  }

  getConversationByRoomId(roomId: string) {
    return this.http.get<{success: boolean, conversation: any, users: any[]}>(BACKEND_URL + "room/" + roomId);
  }
  
  getChatByRoomId(roomId: string) {
    return this.http.get<{success: boolean, chats: any[]}>(BACKEND_URL + "room/chat/" + roomId);
  }

  getRecentConversation() {}

  initiate(type: string, userIds: any[]) {
    const initiateData = {type: type, userIds: userIds};
    return this.http.post<{success: boolean, chatRoom: any}>(BACKEND_URL + "room/initiate", initiateData);
  }

  sendMessage(roomId: string, messageText: string) {
    const messageData = {messageText: messageText};
    return this.http.post<{success: boolean, post: any}>(BACKEND_URL + "room/" + roomId + "/message", messageData);
  }
}
