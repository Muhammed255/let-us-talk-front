import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AuthService } from './components/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit, AfterViewInit {
  public userImage = "assets/img/app/user.jpg";

  @ViewChild('sidenav') sidenav:any;
  public showSidenav:boolean = false;


  constructor(private authService: AuthService) { }
  

  ngOnInit() {
    this.authService.autoAuthUser();
  }

  ngAfterViewInit(): void {
    if(window.innerWidth <= 960){
      this.sidenav.close(); 
    }
  }
  
}
