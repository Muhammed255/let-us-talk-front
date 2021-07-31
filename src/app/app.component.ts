import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './components/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  public userImage = 'assets/img/app/user.jpg';

  @ViewChild('sidenav') sidenav: any;
  public showSidenav: boolean = false;
  authUser: any;
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.autoAuthUser();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });
    if (localStorage.getItem('userId')) {
      this.authService
        .getUserById(localStorage.getItem('userId'))
        .subscribe((res) => {
          if (res.success) {
            this.authUser = res.user;
          }
        });
    }
  }

  ngAfterViewInit(): void {
    if (window.innerWidth <= 960) {
      this.sidenav.close();
    }
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
