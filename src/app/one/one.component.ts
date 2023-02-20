import { Component, OnInit } from '@angular/core';
import { TableTemplate, Style } from '@wslksw/my-table';
import { Subject } from 'rxjs';
import { ThemeColorService } from '../service/theme-color.service';
import { DoublecaseService } from '../service/doublecase.service';

@Component({
  selector: 'app-one',
  templateUrl: './one.component.html',
  styleUrls: ['./one.component.scss'],
  providers:[DoublecaseService]
})
export class OneComponent implements OnInit {
  List: any[] = []
  isLoading: boolean = false;
  changeValue: { data: any[]; screening: boolean; } = { data: [], screening: false }
  // changeValue: Subject<{ data: any[], screening: boolean }> = new Subject()
  HitBottomLine: boolean = false;
  TableTemplate: TableTemplate[] = [
    { title: { title: 'URL', style: Style.link }, value: 'url' },
    { title: { title: 'UID' }, value: 'uid' },
    { title: { title: 'OrderId' }, value: 'orderId' },
    { title: { title: 'Email' }, value: 'ownerEmail' }]
  constructor(private DoublecaseService:DoublecaseService) {
    alert(this.DoublecaseService.value)
    // var a={ data: , screening: false }

    this.changeValue.data = [{ "id": "9", "uid": "118", "url": "https://tekcard.io/card/9", "orderId": null, "ownerId": null, "ownerEmail": null }]
    // this.changeValue.next(a) 
    console.log(this.changeValue);
  }
  ngOnInit(): void {


  }
  Scroll(event: boolean) {
    console.log('scroll', event);
  }
}
