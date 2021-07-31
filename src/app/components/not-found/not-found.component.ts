import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html'
})
export class NotFoundComponent{
  public form:FormGroup;


  constructor(public router:Router, public fb: FormBuilder) {
  }

  ngOnInit(){
    this.form = this.fb.group({
      'param': [null, Validators.required]
    });
  }

  public goHome(): void {
    this.router.navigate(['/home']);
  }

}