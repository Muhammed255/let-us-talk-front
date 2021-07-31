import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private type: string;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getType() {
    return this.type;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(
    firstName: string,
    lastName: string,
    type: string,
    email: string,
    password: string
  ) {
    const authData = {
      firstName,
      lastName,
      type,
      email,
      password,
    };
    this.http
      .post<{ success: boolean; user: any }>(
        BACKEND_URL + 'users/signup',
        authData
      )
      .subscribe(
        (res) => {
          if (res.success) {
            this.router.navigateByUrl('/auth/login');
          }
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }

  login(email: string, password: string) {
    const authData = { email: email, password: password };
    this.http
      .post<{
        success: boolean;
        msg: string;
        token: string;
        expiresIn: number;
        userId: string;
        type: string
      }>(BACKEND_URL + 'login', authData)
      .subscribe(
        (response) => {
          if (response.success) {
            const token = response.token;
            const type = response.type;
            this.token = token;
            this.type = type;
            if (token) {
              const expiresInDuration = response.expiresIn;
              this.setAuthTimer(expiresInDuration);
              this.isAuthenticated = true;
              this.userId = response.userId;
              this.authStatusListener.next(true);
              const now = new Date();
              const expirationDate = new Date(
                now.getTime() + expiresInDuration * 1000
              );
              console.log(expirationDate);
              this.saveAuthData(token, expirationDate, this.userId, type);
              this.router.navigateByUrl('/home');
            }
          }
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }

  getUserById(userId: string) {
    return this.http.get<{success: boolean, user: any}>(BACKEND_URL + "users/" + userId);
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    this.type = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigateByUrl('/auth/login');
  }

  private setAuthTimer(duration: number) {
    console.log('Setting timer: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string, type: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('type', type);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('type');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const type = localStorage.getItem('type');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      type: type,
    };
  }
}
