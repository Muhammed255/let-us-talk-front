import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ChatComponent } from './chat.component';
import { MaterialModule } from 'src/app/shared/material.module';

export const routes = [
  { path: '', component: ChatComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    ChatComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    PerfectScrollbarModule,
    MaterialModule
  ]
})
export class ChatModule { }