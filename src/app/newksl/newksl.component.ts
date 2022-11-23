import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, EMPTY, Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-newksl',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './newksl.component.html',
  styleUrls: ['./newksl.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewkslComponent implements OnInit {
  numbers$!: Observable<number[]>;
  constructor(
    private ActivateRoute: ActivatedRoute
  ) {
    this.numbers$ = of([0, 1, 2, 3, 4, 5, 6])
    this.numbers$.pipe(
      catchError(Error => {
        // this.errorMessage = Error;
        console.log(Error)
        return EMPTY;
      })).subscribe(_ => {
        setTimeout(() => {
          _[0] = 1
          console.log(_)
        }, 5000);


      })
  }

  ngOnInit(): void {
    window.addEventListener('load',()=>{
      //FastClick.attach(document.body);
    }, false);

    this.ActivateRoute.data.subscribe(_ => {
      if (_['msg']) {
        //alert('loading...')
      } else {
        alert('loading...')
      }
      console.log(_)
    })
    //showOpenFilePicker()

  }
  Button() {
    const constraints = {
      'video': true,
      'audio': true
    }
    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        console.log('Got MediaStream:', stream);
      })
      .catch(error => {
        console.error('Error accessing media devices.', error);
      });
  }
}
interface language {
  english: () => string
}
