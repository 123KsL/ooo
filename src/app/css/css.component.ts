import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-css',
  templateUrl: './css.component.html',
  styleUrls: ['./css.component.scss']
})
export class CssComponent implements OnInit {
  List: any[] = new Array(51);
  constructor() { }

  ngOnInit(): void {
  }

}
