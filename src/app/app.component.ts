import { Component, OnInit } from '@angular/core';
import { AuthService } from './components/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent implements OnInit {
  title = 'let-us-talk';

  constructor(private authService: AuthService) { }
  

  ngOnInit() {
    this.authService.autoAuthUser()
  }
}
