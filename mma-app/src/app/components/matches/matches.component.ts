import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {
  organizations: string[] = ['UFC', 'Bellator'];
  matches = [
    {
      event:"UFC 222",
      fight:"Dustin Vs. Khabib"
    },
    {
      event:"UFC 223",
      fight:"Mcgregor Vs. Khabib"
    },
    {
      event:"UFC 225",
      fight:"Dustin Vs. Alverez"
    }
  ];
  pageLength: number = 10;
  pageSize: number = 5;
  pageSizeOptions: number[] = [1,5,10,20]

  constructor() { }

  ngOnInit() {
  }

}
