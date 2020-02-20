import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { MatFormFieldModule, MatInputModule, MatButtonModule, MatToolbarModule, MatMenuModule, MatSelectModule, MatIconModule } from '@angular/material';



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
    MatIconModule
  ],
  exports:[
    HeaderComponent
  ]
})
export class HeaderModule { }
