import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-sss',
  templateUrl: './sss.component.html',
  styleUrls: ['./sss.component.scss'],
  encapsulation:ViewEncapsulation.ShadowDom
})
export class SssComponent implements OnInit {
  name: string[] = ['name'];
  changeName:Subject<string>=new Subject()
  constructor() { }

  ngOnInit(): void {
  }

  ChangeName() {
    // this.name[0]='name changed'
    this.name.push('name changed')
    // this.name = ['name changed']
    this.changeName.next('name')
  }
}

void function () {
  onhashchange = e => console.log(e)
}()

void function () {
  window.onhashchange = e => console.log(e)
}()
type A = { a: string | number }
interface B { b: string | number }
