import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { MatFormFieldModule, MatInputModule, MatButtonModule, MatToolbarModule, MatMenuModule, MatSelectModule, MatIconModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    MatSelectModule,
    MatIconModule,
    RouterModule,
    FormsModule
  ],
  exports:[
    HeaderComponent
  ]
})
export class HeaderModule { }
