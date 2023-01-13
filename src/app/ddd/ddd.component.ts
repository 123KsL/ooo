//declare type ClassDecorator = <TFunction extends Function>(target: TFunction) => TFunction | void;




import { Component, Inject, OnInit } from '@angular/core';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { compact, difference, padEnd, padStart, pullAllBy, sortedUniq, uniqueId } from 'lodash';
@Component({
  selector: 'app-ddd',
  templateUrl: './ddd.component.html',
  styleUrls: ['./ddd.component.scss']
})
@Greeter("Hello TS!")
export class DddComponent implements OnInit {
  count:number = 0;
  b:any=1;
  constructor(
    //@Inject(String) private url:string
    ) {
      // super('')
// alert(exports.count);
    //console.log(,'dddddd')
    //(DddComponent as any).greet();
    // console.log(compact(undefined).join(','))



    // console.log(padStart('abc', 6, '0'), padEnd('wsx', 7, '0'))
    // console.log(sortedUniq([1, 2, { 'x': 555 }, { 'x': 555 }, 2]))
    // console.log(pullAllBy([1, 2, 3, 4, 5, { 'x': 8 }, { 'y': 9 }, { 'y': 10 }], [{ 'x': 1 }, { 'x': 3 }, { 'y': 10 }], 'y'))
    // console.log(compact([1, '', false, 2]))
    // console.log(difference([3, 2, 1], [4, 2]))
    // console.time('start');
    // console.log(uniqueId(), uniqueId(), uniqueId(), uniqueId(), uniqueId(), uniqueId('wsx_'), uniqueId('wsx_'), uniqueId('wsx_'), uniqueId('wsx_'), uniqueId('wsx_'))
    // console.timeEnd('end');
  }

  ngOnInit(): void {

    var scene = new THREE.Scene();

    var mTLLoader = new MTLLoader(); //材质文件加载器
    var objLoader = new OBJLoader(); //obj加载器
    objLoader.load("./Untitled.obj", (obj) => {
      console.log('load', obj)
      scene.add(obj);
    });



    mTLLoader.load('./Untitled.mtl', (materials) => {
      // 返回一个包含材质的对象MaterialCreator
      console.log(materials);
      //obj的模型会和MaterialCreator包含的材质对应起来
      objLoader.setMaterials(materials);
      objLoader.load('./Untitled.obj', (obj) => {
        console.log(obj);
        scene.add(obj); //返回的组对象插入场景中
        // 加载后操作
        // obj.children[0].scale.set(2, 2, 2); //缩放球体网格模型
        // // 通过调节参数，地球表面的凹凸感更强
        // obj.children[0].material.normalScale.set(3, 3);
      })
    })



    /**
    * 相机设置
    */
    var width = 500 //窗口宽度
    var height = 500 //窗口高度
    var k = width / height; //窗口宽高比
    var s = 100; //三维场景显示范围控制系数，系数越大，显示的范围越大
    //创建相机对象
    var camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
    camera.position.set(100, 100, 100); //设置相机位置
    camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height); //设置渲染区域尺寸
    renderer.setClearColor(0xccbaaa, 1); //设置背景颜色
    document.body.appendChild(renderer.domElement); //body元素中插入canvas对象
    //执行渲染操作  指定场景、相机作为参数
    function render() {
      renderer.render(scene, camera); //执行渲染操作
      requestAnimationFrame(render); //请求再次执行渲染函数render
    }
    render();
  }

  a(s: a) {
    //Array.from()
    //location.assign();
    //location.replace()
    //location.reload()
    // const xhr = new XMLHttpRequest()
    // xhr.open('GET', ' http://www.google.com')
    // xhr.send()
    // xhr.onload = function () {
    //   const blob = new Blob([xhr.response], { type: 'text/html' })
    //   const a = document.createElement('a')
    //   a.href = URL.createObjectURL(blob)
    //   a.download = 'google.html'
    //   a.click()
    // }
    //URL.createObjectURL()
    //URL.revokeObjectURL(url)

    //'aaa'.substring()
    Object.entries({ a: 4 })
    Object.fromEntries([['name', 'maxwell']]);
    //[1,1,2,3,[1,2,3,[1,5,65]]].flat(depth)
    Object.hasOwn({ a: 111 }, 'a');
    this.a1('555Event')
    return BigInt(Math.pow(2, 55));
    // qq.chooseAddress({
    //   success(res){
    //       console.log("success", res);
    //    },
    //    fail(res){
    //       console.log("fail", res);
    //    }
    // })
  }
  a1(e: `${number}Event`) {

  }
  // a2<T>(e:T){
  //   e?.toUpperCase()
  // }

}



// const classDecorator: ClassDecorator = target => {
//   target.prototype.sayName = () => console.log('override');
// }
// export class TestClassDecorator {
//   name: string;
//   constructor(name: string) {
//     this.name = name;
//   }
//   sayName() {
//     console.log(this.name)
//   }
// }
// Reflect.decorate([classDecorator], TestClassDecorator) // 对其进行装饰
// const t = new TestClassDecorator('nihao')
// t.sayName() // 'override'




//(new DddComponent() as any).greet();
function Greeter(greeting: string) {
  return function (target: Function) {
    console.log(target)
    target.prototype.greet = function (): void {
      //alert(greeting)
      //console.log(greeting);
    };
  };
}
function logProperty(target: any, key: string) {
  console.log(target, key)
  delete target[key];

  const backingField = "_" + key;

  Object.defineProperty(target, backingField, {
    writable: true,
    enumerable: true,
    configurable: true
  });

  // property getter
  const getter = function (this: any) {
    const currVal = this[backingField];
    console.log(`Get: ${key} => ${currVal}`);
    return currVal;
  };

  // property setter
  const setter = function (this: any, newVal: any) {
    console.log(`Set: ${key} => ${newVal}`);
    this[backingField] = newVal;
  };

  // Create new property with getter and setter
  Object.defineProperty(target, key, {
    get: getter,
    set: setter,
    enumerable: true,
    configurable: true
  });
}


class Person {
  @logProperty
  public name: string;

  constructor(name: string) {
    this.name = name;
  }
}


const p1 = new Person("kylee");
p1.name = "xiaozhang";


function log(target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
  let originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    //alert("wrapped function: before invoking " + propertyKey)
    console.log("wrapped function: before invoking " + propertyKey);
    let result = originalMethod.apply(this, args);
    console.log("wrapped function: after invoking " + propertyKey);
    return result;
  };
}

class Task {
  @log
  runTask(arg: any): any {
    console.log("runTask invoked, args: " + arg);
    return "finished";
  }
}

let task = new Task();
let result = task.runTask("learn ts");
console.log("result: " + result);



// a.ts
namespace Shape {
  const pi = Math.PI;
  export function circle(r: number) {
    return pi * r ** 2 
  }
}
// b.ts
Shape.circle(2); // 12.566370614359172





// @Greeter("Hello TS!")
// class Greeting {
//   constructor() {
//     // 内部实现


//   }
// }
// (new Greeting() as any).greet(); // console output: 'Hello TS!';


// function Log(target: Function, key: string, parameterIndex: number) {
//   let functionLogged = key || target.prototype.constructor.name;
//   console.log(`The parameter in position ${parameterIndex} at ${functionLogged} has been decorated`);
// }




interface Vector2D { x: number, y: number };
interface Vector3D { x: number, y: number, z: number };

// function calc(vector: Vector2D): void;

// const vector: Vector3D = { x: 1, y: 1, z: 1}

// calc(vector) // Does not throw errors
interface Point {
  x: number;
  y: number;
  w: string;
}

type c = Partial<Point>;//可选
type d = Required<c> //非可选
type f = Pick<Point, 'x' | 'y'>//取交集


//type re = ReturnType< keyof Point>
type no = NonNullable<number | null | undefined | string[]>
type r = Readonly<Point> //只读

//type e1 = Exclude<Point,'x'|'y'>;
type e = Omit<Point, 'x' | 'y'> //排除



type a = keyof Point;


interface Human {
  name: string;
  eat(): void
}
interface Auto extends Human {

}
class Asian implements Human {
  name: string;
  constructor(name: string) {
    this.name = name;
    let someValue: any = "this is a string";
    // let strLength: number = (<string>someValue).length;
    let strLength: number = (someValue as string).length;
  }
  eat() { }
}


// interface Bar {
//   static life: number;
//   work: () => void;
// }
// class Foo {}
// const someVar = Foo;
// const someOtherVar = 123;

const someVar = 123;
type someType = {
  foo: string;
};
export { someVar as aDifferentName , someType as ddd};
export default class someClass {}
// interface AutoInterface extends Auto {} // 接口内只有成员state且类型为number
// class C implements AutoInterface {
//     state = 1
// }
