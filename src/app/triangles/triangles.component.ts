import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-triangles',
  templateUrl: './triangles.component.html',
  styleUrls: ['./triangles.component.scss']
})
export class TrianglesComponent implements OnInit, AfterViewInit {
  value: number = 0;
  @ViewChild('firstCanvas') firstCanvas!: ElementRef;
  constructor(private ApiService: ApiService, private _http: HttpClient) {

    //window.open('mailto:361617463@qq.com');
    //this.sendMail('xxx', 'xxx', 'xxx', 'xxx')

  }

  // sendMail(name: string, email: string, subject: any, message: any) {
  //   const myHeaders = new Headers();
  //   myHeaders.append("Content-Type", "application/json");
  //   myHeaders.set('Authorization', 'Basic ');

  //   const data = JSON.stringify({
  //     "Messages": [{
  //       "From": { "Email": "<YOUR EMAIL>", "Name": "<YOUR NAME>" },
  //       "To": [{ "Email": email, "Name": name }],
  //       "Subject": subject,
  //       "TextPart": message
  //     }]
  //   });

  //   const requestOptions = {
  //     method: 'POST',
  //     headers: myHeaders,
  //     body: data,
  //   };

  //   fetch("https://api.mailjet.com/v3.1/send", requestOptions)
  //     .then(response => response.text())
  //     .then(result => console.log(result))
  //     .catch(error => console.log('error', error));
  // }







  ngAfterViewInit(): void {
    //throw new Error('Method not implemented.');
    // console.log(this.firstCanvas, 'xxx');

    // if (this.firstCanvas.nativeElement.getContext) {
    //   var ctx = this.firstCanvas.nativeElement.getContext('2d');
    //   // drawing code here
    //   ctx.fillStyle = "#999";
    //   // //绘制矩形
    //   // ctx.fillRect(10, 10, 55, 50);
    //   // // 绘制矩形边框
    //   // ctx.strokeRect(10, 70, 100, 50);

    //   // ctx.clearRect(15, 15, 50, 25);//清除指定区域


    //   ctx.beginPath(); //新建一条path
    //   ctx.moveTo(50, 50); //把画笔移动到指定的坐标
    //   ctx.lineTo(0, 70);
    //   ctx.lineTo(0, 120);
    //   ctx.lineTo(50, 140);
    //   ctx.lineTo(100, 120);
    //   ctx.lineTo(100, 70);
    //   //ctx.lineTo(100, 70);  //绘制一条从当前位置到指定坐标(200, 50)的直线.
    //   // ctx.lineTo(50, 200);
    //   //闭合路径。会拉一条从当前点到path起始点的直线。如果当前点与起始点重合，则什么都不做
    //   ctx.closePath();
    //   ctx.stroke(); //绘制路径。
    //   //ctx.fill();

    //   ctx.beginPath(); //新建一条path
    //   ctx.moveTo(70, 50); //把画笔移动到指定的坐标

    //   //ctx.lineTo(100, 70);  //绘制一条从当前位置到指定坐标(200, 50)的直线.
    //   // ctx.lineTo(50, 200);
    //   //闭合路径。会拉一条从当前点到path起始点的直线。如果当前点与起始点重合，则什么都不做
    //   ctx.closePath();
    //   ctx.stroke(); //绘制路径。
    //   ctx.fill();


    // } else {
    //   console.log('no')
    //   // canvas-unsupported code here
    // }
  }
  ItemList!: item[]
  ItemList1!: item[]
  ngOnInit(): void {
    this.ApiService.getTypeRequest('user/tableGet').subscribe((res: any) => {
      this.ItemList = res.data
      console.log(res)
    })
    this.ApiService.getTypeRequest('user1/tableGet').subscribe((res: any) => {
      this.ItemList1 = res.data
      console.log(res)
    })
    
    // this.getUserMedia()
  }
  getUserMedia() {
    var mediaDevices = navigator.mediaDevices;
    mediaDevices.getUserMedia({ audio: true, video: true })
      .then((stream) => {
        console.log(stream, 'stream')
        /* 使用这个 stream stream */
      })
      .catch((err) => {
        console.log(err, 'error')
        /* 处理 error */
      });
  }
  FromGroup: FormGroup = new FormGroup({
    name: new FormControl<string | null>(null, {
      validators: [Validators.required],
      updateOn: 'change'
    }),
    count: new FormControl<number | null>(null, {
      validators: [Validators.required],
      updateOn: 'change'
    })
  })
  FromGroupEdit: FormGroup = new FormGroup({
    count1: new FormControl<number | null>(null, {
      validators: [Validators.required],
      updateOn: 'change'
    })
  })
  OK() {
    this.ApiService.postTypeRequest('user/tablePost', this.FromGroup.value).subscribe((res: any) => {
      console.log(res)
      this.ItemList.push(this.FromGroup.value)
    })
  } 
  OK1() {
    this.ApiService.postTypeRequest('user/tablePost', this.FromGroup.value).subscribe((res: any) => {
      console.log(res)
      this.ItemList.push(this.FromGroup.value)
    })
  }
  

  Delete(item: item, index: number) {
    console.log(item)
    this.ApiService.deleteTypeRequest(`user/tableDelete/${item.name}`,undefined).subscribe(_ => {
      this.ItemList.splice(index, 1)
    })
  }

  postTypeRequest1() {
    console.log('first')
    //https://openai.weixin.qq.com/openapi/aibot/{TOKEN}
    this._http.post(`https://openai.weixin.qq.com/openapi/sign/{WNgis2PaSDBKPh2QByJ0uRs1FMdG7r}`, {
      username: 'username',
      avatar: 'avatar',
      userid: 'l16yMzTcqCbx19a'
    }).subscribe(_ => {
      console.log(_)
    })
  }
  fileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    console.log(files[0])
    this.ApiService.postTypeRequest('user/files', files[0]).subscribe(_ => {
      console.log(_)
    })
  }
  openEdit(){

  }
}
interface item {
  name: string,
  count: number
}