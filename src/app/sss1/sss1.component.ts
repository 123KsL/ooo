import { CommonModule } from '@angular/common';
import { ApplicationRef, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { NgModel } from '@angular/forms';
import { AsyncSubject, every, filter, from, interval, map, materialize, multicast, Observable, of, scan, Subject, take, toArray } from 'rxjs';

@Component({
  selector: 'app-sss1',
  templateUrl: './sss1.component.html',
  styleUrls: ['./sss1.component.scss'],
  standalone: true,
  //imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
  // styles:'border:1px solid black',
})
export class Sss1Component implements OnInit, OnChanges {
  obc!: Observable<string[]>
  @Input() name!: string[]
  @Input() nameChange!: Subject<string>
  constructor(
    private ChangeDetectorRef: ChangeDetectorRef,
    private applicationRef: ApplicationRef
  ) {
    setTimeout(() => {
      this.a = 5 + 1;
      console.log(this.a);
      // this.ChangeDetectorRef.detectChanges()
      // this.applicationRef.tick()

    }, 5000);
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    // console.log('first');

    // const upperCase = of('a', 'b','c', 13, 'e','d').pipe(map((x: any) => x));
    // const materialized = upperCase.pipe(materialize()).subscribe(x =>
    //   console.log(x)
    //   // if(x)console.log(object);
    //   );

    //const source = interval(1000);

    // const example = source.pipe(
    //   take(10),
    //   toArray()
    // ).subscribe(_=>{
    //   console.log(_);
    // })
    //  const arr:number[]=[1, 2, 3,6]
    //     from(arr)
    //     .pipe(
    //       //filter(x=>x>1),
    //       // scan((x,index)=>x + index),
    //       map((y,index) =>index)
    //       ).subscribe(_=>{
    //         arr[_]+1
    //         if(_==arr.length-1)console.log(arr);
    //       })

    //       arr.filter(_=>{
    //         _+1
    //         if(_==arr.length-1)console.log(arr);
    //       })
    // console.log(arr);
    // .subscribe(x => console.log(x)); // -> false
    // if (this.nameChange) this.nameChange.subscribe(_ => { console.log('name'); })


    // const subject = new Subject<number>();

    // subject.subscribe({
    //   next: (v) => console.log(`observerA: ${v}`),
    // });
    // subject.subscribe({
    //   next: (v) => console.log(`observerB: ${v}`),
    // });

    // subject.next(1);
    // subject.next(2);
    // const observable = from([1, 2, 3]);
    // observable.subscribe(_ => {
    //   console.log([_ + 1], 'xxxxx');
    //   if (_ > 1) {
    //     console.log('大于1');
    //   }

    // });



  }

  ngOnChanges(changes: SimpleChanges): void {

    // console.log(changes['name'].currentValue?.at(0));

    // const observable = new Observable((subscriber) => {
    //   subscriber.next(1);
    //   subscriber.next(2);
    //   subscriber.next(3);
    //   setTimeout(() => {
    //     subscriber.next(4);
    //     subscriber.complete();
    //   }, 1000);
    // });
    // observable.subscribe(_ => {
    //   console.log(_);
    // })


  }
  subject = new AsyncSubject();
  a: number = 0
  start() {
    this.a = this.a + 1
    // console.log(this.a);
    // this.subject.next(this.a + 1);
    // this.subject.complete();
    // this.subject.subscribe({
    //   next: (v) => console.log(`observerA: ${v}`),
    // });

  }


  ngOnInit(): void {
  }

}
