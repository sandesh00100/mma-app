import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {
  organizations: string[] = ['UFC', 'Bellator'];
  events: string[] = ['UFC 222', 'UFC 233', 'UFC 234']
  constructor() { }

  ngOnInit() {
  }

}
