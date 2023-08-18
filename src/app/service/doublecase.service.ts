import { Injectable } from '@angular/core';

@Injectable({
  //providedIn: 'root' 默认 单例实例化，并将在整个应用程序中可用。
  //当providedIn设置为特定模块时，服务将注册到该模块的注入器。这意味着该服务将在每个模块中实例化一次，并且仅可用于该模块或其子模块中声明的组件和服务。
  providedIn: 'any', //则服务可能会被多次实例化
  //providedIn: 'platform' //页面上所有应用程序共享的特殊单例平台注入器。
  // multi:true
  // providedIn:
})
export class DoublecaseService {
  value: number = 0;
  constructor() { }
}
