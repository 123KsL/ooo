import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResolveService implements Resolve<string>{
  a!: string
  constructor() { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): string | Observable<string> | Promise<string> {
    //throw new Error('Method not implemented.');
    console.log(route, state)
    // setTimeout(() => {
    //   this.a = '20'
    // }, 5000);
    return 'xxx'
  }
}
