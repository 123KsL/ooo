import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, debounceTime, EMPTY, Observable, of, Subject, switchMap, takeUntil, tap, timer } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import * as GIF from 'gif.js';
// import { GIF } from 'gif.js';
//declare const GIF : any;
//import * as html2canvas from 'html2canvas';
// import html2canvas from 'html2canvas';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-newksl',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './newksl.component.html',
  styleUrls: ['./newksl.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewkslComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('video') videoElem!: ElementRef;
  @ViewChild('video1') videoElem1!: ElementRef;
  @ViewChild('canvas') canvasElem!: ElementRef;
  @ViewChild('StarCanvas') StarCanvas!: ElementRef;
  @ViewChild('gifImageElement') gifImageElement!: ElementRef;
  @ViewChild('gifCanvas') gifCanvas!: ElementRef;
  @ViewChild('watermarking') watermarking!: ElementRef;


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
  ngAfterViewInit(): void {
    //throw new Error('Method not implemented.');
    this.star();
  }
  chunks: any[] = [];
  ngOnDestroy(): void {
    this.unSub.next();
    this.unSub.complete();
    // if (this.videoElem.nativeElement.srcObject){
    //   alert('a')
    //   const blob = new Blob(this.chunks, {
    //     type: 'video/webm;codecs=vp9',
    //   })
    //   this.chunks = [];
    //   const blobUrl = URL.createObjectURL(blob)

    //   console.log(blobUrl)
    //   localStorage.setItem('blobUrl',blobUrl)
    // }

    //throw new Error('Method not implemented.');
  }
  startCapture() {
    let captureStream = null;

    return navigator.mediaDevices.getDisplayMedia()
      .catch(err => { console.error("Error:" + err); return null; });
  }

  logElem() {

  }
  private unSub = new Subject<void>();
  blob!: Blob
  async recordStream() {
    let recorder: MediaRecorder | null = null
    //const stream = await captureMediaDevices()
    recorder = new MediaRecorder(this.srcObject)


    recorder.ondataavailable = (event: any) => {
      if (event.data.size > 0) {
        this.chunks.push(event.data)
      }
    }







    recorder.onstop = () => {
      console.log(this.chunks);
      this.chunks = [];
      const blobUrl = URL.createObjectURL(this.blob);

      console.log(blobUrl)
      localStorage.setItem('blobUrl', blobUrl)
    }

    recorder.start(200);

    timer(0, 5000).pipe(  //初始延迟时间,间隔时间
      tap((x) => {
        //  console.log(x);
        //  console.log(this.chunks) ;
        this.blob = new Blob(this.chunks, {
          type: 'video/webm;codecs=vp9',
        });
        this.chunks = []
        console.log(this.blob)
        //this.WebSocket.send(this.blob);
      }),
      //debounceTime(1000),
      takeUntil(this.unSub),
      switchMap(async (res) => this.WebSocket.send(this.blob))).subscribe(_ => {
        this.SendBlob();
        console.log('subscribe', _)
      })

  }
  SendBlob() {
    console.log(this.WebSocketStatus)

    if (this.WebSocketStatus.onerror || this.WebSocketStatus.onclose) {
      console.log('连接loading')
      this.WebSocket.onopen = (data) => {
        this.WebSocketStatus = {
          onopen: true, onerror: false, onclose: false
        }
        // 发送信息
        console.log('用于指定连接成功后的回调函数。', data)
        this.blob = new Blob(this.chunks, {
          type: 'video/webm;codecs=vp9',
        });
        this.WebSocket.send(this.blob);
      };
    }
  }









  download() {
    const url = window.URL.createObjectURL(this.blob);
    const anchor = document.createElement("a");
    anchor.download = 'downloadName'
    anchor.href = url;
    anchor.click();
  }
  async startElem() {

    navigator.mediaDevices.getDisplayMedia({ video: true, audio: false })
      .then((stream) => {
        console.log(this.videoElem.nativeElement.srcObject, stream)

        this.srcObject = stream
        //this.videoElem.nativeElement.play();
      })
      .catch((err) => {
        console.error(`An error occurred: ${err}`);
      });


    //this.videoElem.nativeElement.srcObject = navigator.mediaDevices.getDisplayMedia({video: true});


    // try {
    //   this.videoElem.nativeElement.srcObject = navigator.mediaDevices.getDisplayMedia({video: true});
    //   console.log(this.videoElem.nativeElement.srcObject)
    //   //dumpOptionsInfo();
    //   const videoTrack = this.videoElem.nativeElement.srcObject.getVideoTracks()[0];

    //   console.info("Track settings:");
    //   console.info(JSON.stringify(videoTrack.getSettings(), null, 2));
    //   console.info("Track constraints:");
    //   console.info(JSON.stringify(videoTrack.getConstraints(), null, 2));
    // } catch (err) {
    //   console.error("Error: " + err);
    // }
  }
  srcObject!: MediaStream
  start1() {
    // localStorage.setItem('MediaStreamData',this.srcObject)
    console.log(this.srcObject, JSON.stringify(this.srcObject))
    this.videoElem.nativeElement.srcObject = this.srcObject;
    //this.WebSocket.send(this.srcObject);
    const videoTrack = this.videoElem.nativeElement.srcObject.getVideoTracks()[0];

    console.info("Track settings:");
    console.info(JSON.stringify(videoTrack.getSettings(), null, 2));
    console.info("Track constraints:");
    console.info(JSON.stringify(videoTrack.getConstraints(), null, 2));
    this.recordStream()
  }
  stop1() {
    this.videoElem.nativeElement.srcObject = null
  }
  stopElem() {

    let tracks = this.videoElem.nativeElement.srcObject.getTracks();
    tracks.forEach(track => track.stop());
    this.videoElem.nativeElement.srcObject = null;
  }
  WebSocketStatus!: WebSocketStatus
  WebSocket: WebSocket = new WebSocket("ws://127.0.0.1:8001");
  ngOnInit(): void {
    // 开启WebSocket服务
    console.log('连接loading')
    this.WebSocket.onopen = (data) => {
      this.WebSocketStatus = {
        onopen: true, onerror: false, onclose: false
      }
      // 发送信息
      console.log('用于指定连接成功后的回调函数。', data)
    };
    this.WebSocket.onmessage = (data) => {
      console.log('用于指定当从服务器接受到信息时的回调函数。', data); // 接收信息



      const url = window.URL.createObjectURL(data.data);


      // this.videoElem1.nativeElement.src = URL.createObjectURL(data.data);
      // this.videoElem1.nativeElement.load().then(_=>{
      //   console.log(_,'loadSuccess')
      // });

      // 创建新的 Image 对象
      // const img = new Image();

      // // 设置 Image 对象的 src 属性
      // img.src = url;
      // console.log(this.canvasElem.nativeElement)
      // // 获取 canvas 的 2D 绘图上下文
      // const ctx = this.canvasElem.nativeElement.getContext('2d');

      // // 在画布上绘制图像
      // ctx.drawImage(img, 0, 0);
      // // 等待图像加载完成
      // img.onload = () => {
      //   // 获取 canvas 元素


      // };


      // 创建新的 HTMLVideoElement 对象
      const video = document.createElement('video');

      // 设置 HTMLVideoElement 对象的 src 属性
      video.src = url;

      // 等待视频加载完成
      video.onloadedmetadata = () => {
        // 获取 canvas 元素


        // 获取 canvas 的 2D 绘图上下文
        const ctx = this.canvasElem.nativeElement.getContext('2d');

        // 在视频播放的时候，不断地将视频帧绘制到画布上
        video.addEventListener('play', () => {
          const loop = () => {
            if (!video.paused && !video.ended) {
              ctx.drawImage(video, 0, 0);
              setTimeout(loop, 1000 / 30);  // 每秒 30 帧
            }
          };
          loop();
        });

        // 开始播放视频
        video.play();
        console.log(url)
      };
      this.WebSocket.onclose = (data) => {
        console.log("用于指定关闭成功后的回调函数。", data); //关闭
        this.WebSocketStatus = {
          onopen: false, onerror: false, onclose: true
        }

      };
      this.WebSocket.onerror = (error) => {
        this.WebSocketStatus = {
          onopen: false, onerror: true, onclose: false
        }
        console.log("用于指定连接失败后的回调函数。", error); //关闭
      };




      // Options for getDisplayMedia()






      // window.addEventListener('load',()=>{
      //   //FastClick.attach(document.body);
      // }, false);

      // this.ActivateRoute.data.subscribe(_ => {
      //   if (_['msg']) {
      //     //alert('loading...')
      //   } else {
      //     alert('loading...')
      //   }
      //   console.log(_)
      // })
      //showOpenFilePicker()

    }
  }



  UserMedia() {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      // 获取视频流中的视频轨道
      const videoTrack = stream.getVideoTracks()[0];

      // 获取 MediaTrackSettings 对象
      const trackSettings = videoTrack.getSettings();

      // 设置 torch 属性
      // trackSettings.torch = false;

      // 应用设置
      videoTrack.applyConstraints({ advanced: [trackSettings] });
    });
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
  star() {
    let canvas = this.StarCanvas.nativeElement
    var ctx = canvas.getContext('2d');


    const centerX = 100;
    const centerY = 100;
    const radius = 100;

    ctx.moveTo(centerX, centerY - radius);
    for (let i = 0; i < 5; i++) {
      const angle = 72 * i * Math.PI / 180;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      ctx.lineTo(x, y);
    }
    ctx.closePath();

    ctx.fillStyle = 'red';
    ctx.fill();
  }
  gif() {
    //const div = document.getElementById('your-div-id');
    //html2canvas()

    // var img = new Image();
    // img.src = 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fgd-hbimg.huaban.com%2F853cf618798bf2f6b992fd57eabafc880bd678e115fc7b-RG1vof_fw658&refer=http%3A%2F%2Fgd-hbimg.huaban.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1666006173&t=dc8f94e8b52b06e1cacecd8d227e6191';
    // img.onload = ()=>{
    //     var canvas = document.createElement('canvas');
    //     var ctx = canvas.getContext('2d');
    //     canvas.width = img.width;
    //     canvas.height = img.height;
    //     ctx!.drawImage(img, 0, 0);

    //     html2canvas(canvas).then((canvas0)=>{
    //         // do something with the canvas
    //         const canvas1 = this.gifCanvas.nativeElement;
    //         canvas1.width = canvas0.width;
    //         canvas1.height = canvas0.height;
    //         const ctx = canvas1.getContext('2d');
    //         ctx.drawImage(canvas0, 0, 0);
    //     });
    // };




    html2canvas(this.gifImageElement.nativeElement).then(canvas => {
      const canvas1 = this.gifCanvas.nativeElement;
      canvas1.width = canvas.width;
      canvas1.height = canvas.height;
      const ctx = canvas1.getContext('2d');
      ctx.drawImage(canvas, 0, 0);

      canvas.toDataURL('image/png', 0.02);
      canvas.toBlob((BlobCallback: Blob | null) => {
        console.log(Blob);
        const toBloBurl: string = window.URL.createObjectURL(BlobCallback!);

        window.URL.revokeObjectURL(toBloBurl!);


      }, 'image/png', 0.02)







      //console.log(canvas)

      //console.log(this.gifImageElement.nativeElement)
      //const image = new Image();
      //console.log(canvas.toDataURL())
      //image.src=canvas.toDataURL();

      // Create a link element
      // const link = document.createElement('a');

      // // Set the link's href to the canvas's image data URL
      // link.href = canvas.toDataURL();

      // // Set the link's download attribute to the file name you want
      // link.download = 'my-image.png';

      // // Add the link to the page
      // document.body.appendChild(link);

      // // Click the link to download the image
      // link.click();

      // // Remove the link from the page
      // document.body.removeChild(link);
      //const dataURL = canvas.toDataURL();
      // 在这里处理 canvas



      const copyToClipboard = (text) => navigator.clipboard?.writeText(text);

      copyToClipboard("Hello World!")
    });

    // // /GIF.Options
    // const gif= new GIF({
    //   workers: 2,
    //   quality: 10,
    //   width: 200,
    //   height: 200
    // });

    // gif.addFrame(this.gifImageElement.nativeElement);
    // gif.render();
    // //gif.save('animation.gif');
    // const canvas = this.gifCanvas.nativeElement;
    // canvas.width = this.gifImageElement.nativeElement.offsetWidth;
    // canvas.height = this.gifImageElement.nativeElement.offsetHeight;

    //console.log(canvas.toDataURL())
    //     const image = new Image();

    // // Set the image's src to the data URL
    // image.src = dataURL;
    //     //console.log(canvas.toDataURL())
  }
  images: string[] = ['image1.jpg', 'image2.jpg', 'image3.jpg'];
  onGifLoad(event: any) {
    console.log(event)
    // GIF 加载完成后的处理
  }


  jueJin() {
    let formData = new FormData();
    formData.append("src", "web");
    formData.append("uid", "你的uid");
    formData.append("token", "你的toekn");
    formData.append("device_id", "device_id");
    formData.append("field", "avatarLarge");
    formData.append("value", "你的头像地址");
    const body = {
      "list":
        [{ "ev_type": "http", "payload": { "api": "fetch", "request": { "method": "post", "timestamp": 1673338147986, "url": "https://juejin.cn/user/update/upload_avatar", "headers": {} }, "response": { "is_custom_error": false, "status": 200, "headers": { "content-length": "141", "content-type": "application/json; charset=utf-8", "date": "Tue, 10 Jan 2023 08:09:10 GMT", "eagleid": "7522229816733381499286743e", "server": "Tengine", "server-timing": "inner; dur=58", "timing-allow-origin": "*", "via": "cache4.cn451[127,0]", "x-firefox-spdy": "h2", "x-tt-logid": "20230110160909182519288A3BC91B4C68", "x-tt-timestamp": "1673338150.039", "x-tt-trace-host": "0128694c36def37062831e032d04e53cf073408976a6504865c686022d0acc694149c4a3dd013790a8ffa9dcd2ea5b9daf51c48177c1e516a8238b34d63f23838cf44da9cd042df299c6ad849259e98a897caa0c7d6b6fd28e9dbf634f45b09d7b", "x-tt-trace-tag": "id=3;cdn-cache=miss" }, "timestamp": 1673338148305 }, "duration": 319 }, "common": { "bid": "2608", "pid": "/user/settings/profile", "view_id": "/user/settings/profile_1673338105437", "user_id": "1333024739823806", "device_id": "534efe1c-5726-4562-8d44-1fdf875b574f", "session_id": "c29689d3-6d7e-49b4-94f6-6a42a097fcd9", "release": "1.0.0.6233", "env": "production", "url": "https://juejin.cn/user/settings/profile", "timestamp": 1673338147986, "sdk_version": "1.3.3", "sdk_name": "SDK_SLARDAR_WEB", "context": {}, "network_type": "", "sdk_offset": 1722, "sample_rate": 1 } }]
    }
    // fetch('https://mon.zijieapi.com/monitor_browser/collect/batch/?biz_id=2608', {
    //   method: "POST",
    //   body: body
    // })
  }
  bai_du_Api() {
    // var map = new BMapGL.Map("allmap");
    // var point = new BMapGL.Point(116.331398,39.897445);
    // map.centerAndZoom(point,12);

    // function myFun(result){
    //     var cityName = result.name;
    //     map.setCenter(cityName);
    //     alert("当前定位城市:" + cityName);
    // }
    // var myCity = new BMapGL.LocalCity();
    // myCity.get(myFun); let dataList=[{"type":"Buffer","data":[102,102,109,112,101,103,32,118,101,114,115,105,111,110,32,78,45,49,48,57,53,56,53,45,103,51,55,57,101,52,51,101,54,101,99,45,50,48,50,51,48,49,49,49,32,67,111,112,121,114,105,103,104,116,32,40,99,41,32,50,48,48,48,45,50,48,50,51,32,116,104,101,32,70,70,109,112,101,103,32,100,101,118,101,108,111,112,101,114,115,13,10,32,32,98,117,105,108,116,32,119,105,116,104,32,103,99,99,32,49,50,46,50,46,48,32,40,99,114,111,115,115,116,111,111,108,45,78,71,32,49,46,50,53,46,48,46,57,48,95,99,102,57,98,101,98,49,41,13,10,32,32,99,111,110,102,105,103,117,114,97,116,105,111,110,58,32,45,45,112,114,101,102,105,120,61,47,102,102,98,117,105,108,100,47,112,114,101,102,105,120,32,45,45,112,107,103,45,99,111,110,102,105,103,45,102,108,97,103,115,61,45,45,115,116,97,116,105,99,32,45,45,112,107,103,45,99,111,110,102,105,103,61,112,107,103,45,99,111,110,102,105,103,32,45,45,99,114,111,115,115,45,112,114,101,102,105,120,61,120,56,54,95,54,52,45,119,54,52,45,109,105,110,103,119,51,50,45,32,45,45,97,114,99,104,61,120,56,54,95,54,52,32,45,45,116,97,114,103,101,116,45,111,115,61,109,105,110,103,119,51,50,32,45,45,101,110,97,98,108,101,45,103,112,108,32,45,45,101,110,97,98,108,101,45,118,101,114,115,105,111,110,51,32,45,45,100,105,115,97,98,108,101,45,100,101,98,117,103,32,45,45,101,110,97,98,108,101,45,115,104,97,114,101,100,32,45,45,100,105,115,97,98,108,101,45,115,116,97,116,105,99,32,45,45,100,105,115,97,98,108,101,45,119,51,50,116,104,114,101,97,100,115,32,45,45,101,110,97,98,108,101,45,112,116,104,114,101,97,100,115,32,45,45,101,110,97,98,108,101,45,105,99,111,110,118,32,45,45,101,110,97,98,108,101,45,108,105,98,120,109,108,50,32,45,45,101,110,97,98,108,101,45,122,108,105,98,32,45,45,101,110,97,98,108,101,45,108,105,98,102,114,101,101,116,121,112,101,32,45,45,101,110,97,98,108,101,45,108,105,98,102,114,105,98,105,100,105,32,45,45,101,110,97,98,108,101,45,103,109,112,32,45,45,101,110,97,98,108,101,45,108,122,109,97,32,45,45,101,110,97,98,108,101,45,102,111,110,116,99,111,110,102,105,103,32,45,45,101,110,97,98,108,101,45,108,105,98,118,111,114,98,105,115,32,45,45,101,110,97,98,108,101,45,111,112,101,110,99,108,32,45,45,100,105,115,97,98,108,101,45,108,105,98,112,117,108,115,101,32,45,45,101,110,97,98,108,101,45,108,105,98,118,109,97,102,32,45,45,100,105,115,97,98,108,101,45,108,105,98,120,99,98,32,45,45,100,105,115,97,98,108,101,45,120,108,105,98,32,45,45,101,110,97,98,108,101,45,97,109,102,32,45,45,101,110,97,98,108,101,45,108,105,98,97,111,109,32,45,45,101,110,97,98,108,101,45,108,105,98,97,114,105,98,98,50,52,32,45,45,101,110,97,98,108,101,45,97,118,105,115,121,110,116,104,32,45,45,101,110,97,98,108,101,45,99,104,114,111,109,97,112,114,105,110,116,32,45,45,101,110,97,98,108,101,45,108,105,98,100,97,118,49,100,32,45,45,101,110,97,98,108,101,45,108,105,98,100,97,118,115,50,32,45,45,100,105,115,97,98,108,101,45,108,105,98,102,100,107,45,97,97,99,32,45,45,101,110,97,98,108,101,45,102,102,110,118,99,111,100,101,99,32,45,45,101,110,97,98,108,101,45,99,117,100,97,45,108,108,118,109,32,45,45,101,110,97,98,108,101,45,102,114,101,105,48,114,32,45,45,101,110,97,98,108,101,45,108,105,98,103,109,101,32,45,45,101,110,97,98,108,101,45,108,105,98,107,118,97,122,97,97,114,32,45,45,101,110,97,98,108,101,45,108,105,98,97,115,115,32,45,45,101,110,97,98,108,101,45,108,105,98,98,108,117,114,97,121,32,45,45,101,110,97,98,108,101,45,108,105,98,106,120,108,32,45,45,101,110,97,98,108,101,45,108,105,98,109,112,51,108,97,109,101,32,45,45,101,110,97,98,108,101,45,108,105,98,111,112,117,115,32,45,45,101,110,97,98,108,101,45,108,105,98,114,105,115,116,32,45,45,101,110,97,98,108,101,45,108,105,98,115,115,104,32,45,45,101,110,97,98,108,101,45,108,105,98,116,104,101,111,114,97,32,45,45,101,110,97,98,108,101,45,108,105,98,118,112,120,32,45,45,101,110,97,98,108,101,45,108,105,98,119,101,98,112,32,45,45,101,110,97,98,108,101,45,108,118,50,32,45,45,100,105,115,97,98,108,101,45,108,105,98,109,102,120,32,45,45,101,110,97,98,108,101,45,108,105,98,118,112,108,32,45,45,101,110,97,98,108,101,45,111,112,101,110,97,108,32,45,45,101,110,97,98,108,101,45,108,105,98,111,112,101,110,99,111,114,101,45,97,109,114,110,98,32,45,45,101,110,97,98,108,101,45,108,105,98,111,112,101,110,99,111,114,101,45,97,109,114,119,98,32,45,45,101,110,97,98,108,101,45,108,105,98,111,112,101,110,104,50,54,52,32,45,45,101,110,97,98,108,101,45,108,105,98,111,112,101,110,106,112,101,103,32,45,45,101,110,97,98,108,101,45,108,105,98,111,112,101,110,109,112,116,32,45,45,101,110,97,98,108,101,45,108,105,98,114,97,118,49,101,32,45,45,101,110,97,98,108,101,45,108,105,98,114,117,98,98,101,114,98,97,110,100,32,45,45,101,110,97,98,108,101,45,115,99,104,97,110,110,101,108,32,45,45,101,110,97,98,108,101,45,115,100,108,50,32,45,45,101,110,97,98,108,101,45,108,105,98,115,111,120,114,32,45,45,101,110,97,98,108,101,45,108,105,98,115,114,116,32,45,45,101,110,97,98,108,101,45,108,105,98,115,118,116,97,118,49,32,45,45,101,110,97,98,108,101,45,108,105,98,116,119,111,108,97,109,101,32,45,45,101,110,97,98,108,101,45,108,105,98,117,97,118,115,51,100,32,45,45,100,105,115,97,98,108,101,45,108,105,98,100,114,109,32,45,45,100,105,115,97,98,108,101,45,118,97,97,112,105,32,45,45,101,110,97,98,108,101,45,108,105,98,118,105,100,115,116,97,98,32,45,45,101,110,97,98,108,101,45,118,117,108,107,97,110,32,45,45,101,110,97,98,108,101,45,108,105,98,115,104,97,100,101,114,99,32,45,45,101,110,97,98,108,101,45,108,105,98,112,108,97,99,101,98,111,32,45,45,101,110,97,98,108,101,45,108,105,98,120,50,54,52,32,45,45,101,110,97,98,108,101,45,108,105,98,120,50,54,53,32,45,45,101,110,97,98,108,101,45,108,105,98,120,97,118,115,50,32,45,45,101,110,97,98,108,101,45,108,105,98,120,118,105,100,32,45,45,101,110,97,98,108,101,45,108,105,98,122,105,109,103,32,45,45,101,110,97,98,108,101,45,108,105,98,122,118,98,105,32,45,45,101,120,116,114,97,45,99,102,108,97,103,115,61,45,68,76,73,66,84,87,79,76,65,77,69,95,83,84,65,84,73,67,32,45,45,101,120,116,114,97,45,99,120,120,102,108,97,103,115,61,32,45,45,101,120,116,114,97,45,108,100,102,108,97,103,115,61,45,112,116,104,114,101,97,100,32,45,45,101,120,116,114,97,45,108,100,101,120,101,102,108,97,103,115,61,32,45,45,101,120,116,114,97,45,108,105,98,115,61,45,108,103,111,109,112,32,45,45,101,120,116,114,97,45,118,101,114,115,105,111,110,61,50,48,50,51,48,49,49,49,13,10]},{"type":"Buffer","data":[32,32,108,105,98,97,118,117,116,105,108,32,32,32,32,32,32,53,55,46,32,52,51,46,49,48,48,32,47,32,53,55,46,32,52,51,46,49,48,48,13,10,32,32,108,105,98,97,118,99,111,100,101,99,32,32,32,32,32,53,57,46,32,53,54,46,49,48,48,32,47,32,53,57,46,32,53,54,46,49,48,48,13,10,32,32,108,105,98,97,118,102,111,114,109,97,116,32,32,32,32,53,57,46,32,51,53,46,49,48,48,32,47,32,53,57,46,32,51,53,46,49,48,48,13,10,32,32,108,105,98,97,118,100,101,118,105,99,101,32,32,32,32,53,57,46,32,32,56,46,49,48,49,32,47,32,53,57,46,32,32,56,46,49,48,49,13,10,32,32,108,105,98,97,118,102,105,108,116,101,114,32,32,32,32,32,56,46,32,53,51,46,49,48,48,32,47,32,32,56,46,32,53,51,46,49,48,48,13,10,32,32,108,105,98,115,119,115,99,97,108,101,32,32,32,32,32,32,54,46,32,32,56,46,49,49,50,32,47,32,32,54,46,32,32,56,46,49,49,50,13,10,32,32,108,105,98,115,119,114,101,115,97,109,112,108,101,32,32,32,52,46,32,32,57,46,49,48,48,32,47,32,32,52,46,32,32,57,46,49,48,48,13,10,32,32,108,105,98,112,111,115,116,112,114,111,99,32,32,32,32,53,54,46,32,32,55,46,49,48,48,32,47,32,53,54,46,32,32,55,46,49,48,48,13,10,91,103,100,105,103,114,97,98,32,64,32,48,48,48,48,48,50,52,100,57,55,102,53,55,55,56,48,93,32,67,97,112,116,117,114,105,110,103,32,119,104,111,108,101,32,100,101,115,107,116,111,112,32,97,115,32,49,57,50,48,120,49,48,56,48,120,51,50,32,97,116,32,40,48,44,48,41,13,10]},{"type":"Buffer","data":[91,103,100,105,103,114,97,98,32,64,32,48,48,48,48,48,50,52,100,57,55,102,53,55,55,56,48,93,32,83,116,114,101,97,109,32,35,48,58,32,110,111,116,32,101,110,111,117,103,104,32,102,114,97,109,101,115,32,116,111,32,101,115,116,105,109,97,116,101,32,114,97,116,101,59,32,99,111,110,115,105,100,101,114,32,105,110,99,114,101,97,115,105,110,103,32,112,114,111,98,101,115,105,122,101,13,10]},{"type":"Buffer","data":[73,110,112,117,116,32,35,48,44,32,103,100,105,103,114,97,98,44,32,102,114,111,109,32,39,100,101,115,107,116,111,112,39,58,13,10,32,32,68,117,114,97,116,105,111,110,58,32,78,47,65,44,32,115,116,97,114,116,58,32,49,54,55,51,53,48,49,57,48,51,46,48,49,53,50,48,53,44,32,98,105,116,114,97,116,101,58,32,49,57,56,56,54,56,48,32,107,98,47,115,13,10,32,32,83,116,114,101,97,109,32,35,48,58,48,58,32,86,105,100,101,111,58,32,98,109,112,44,32,98,103,114,97,44,32,49,57,50,48,120,49,48,56,48,44,32,49,57,56,56,54,56,48,32,107,98,47,115,44,32,50,57,46,57,55,32,102,112,115,44,32,49,48,48,48,107,32,116,98,114,44,32,49,48,48,48,107,32,116,98,110,13,10]},{"type":"Buffer","data":[83,116,114,101,97,109,32,109,97,112,112,105,110,103,58,13,10,32,32,83,116,114,101,97,109,32,35,48,58,48,32,45,62,32,35,48,58,48,32,40,98,109,112,32,40,110,97,116,105,118,101,41,32,45,62,32,104,50,54,52,32,40,108,105,98,120,50,54,52,41,41,13,10,80,114,101,115,115,32,91,113,93,32,116,111,32,115,116,111,112,44,32,91,63,93,32,102,111,114,32,104,101,108,112,13,10]},{"type":"Buffer","data":[91,108,105,98,120,50,54,52,32,64,32,48,48,48,48,48,50,52,100,57,55,102,53,99,53,48,48,93,32,117,115,105,110,103,32,99,112,117,32,99,97,112,97,98,105,108,105,116,105,101,115,58,32,77,77,88,50,32,83,83,69,50,70,97,115,116,32,83,83,83,69,51,32,83,83,69,52,46,50,32,65,86,88,32,70,77,65,51,32,66,77,73,50,32,65,86,88,50,32,65,86,88,53,49,50,13,10]},{"type":"Buffer","data":[91,108,105,98,120,50,54,52,32,64,32,48,48,48,48,48,50,52,100,57,55,102,53,99,53,48,48,93,32,112,114,111,102,105,108,101,32,72,105,103,104,32,52,58,52,58,52,32,80,114,101,100,105,99,116,105,118,101,44,32,108,101,118,101,108,32,52,46,48,44,32,52,58,52,58,52,44,32,56,45,98,105,116,13,10,91,108,105,98,120,50,54,52,32,64,32,48,48,48,48,48,50,52,100,57,55,102,53,99,53,48,48,93,32,54,52,32,45,32,99,111,114,101,32,49,54,52,32,45,32,72,46,50,54,52,47,77,80,69,71,45,52,32,65,86,67,32,99,111,100,101,99,32,45,32,67,111,112,121,108,101,102,116,32,50,48,48,51,45,50,48,50,50,32,45,32,104,116,116,112,58,47,47,119,119,119,46,118,105,100,101,111,108,97,110,46,111,114,103,47,120,50,54,52,46,104,116,109,108,32,45,32,111,112,116,105,111,110,115,58,32,99,97,98,97,99,61,48,32,114,101,102,61,49,32,100,101,98,108,111,99,107,61,48,58,48,58,48,32,97,110,97,108,121,115,101,61,48,58,48,32,109,101,61,100,105,97,32,115,117,98,109,101,61,48,32,112,115,121,61,48,32,109,105,120,101,100,95,114,101,102,61,48,32,109,101,95,114,97,110,103,101,61,49,54,32,99,104,114,111,109,97,95,109,101,61,49,32,116,114,101,108,108,105,115,61,48,32,56,120,56,100,99,116,61,48,32,99,113,109,61,48,32,100,101,97,100,122,111,110,101,61,50,49,44,49,49,32,102,97,115,116,95,112,115,107,105,112,61,48,32,99,104,114,111,109,97,95,113,112,95,111,102,102,115,101,116,61,48,32,116,104,114,101,97,100,115,61,49,56,32,108,111,111,107,97,104,101,97,100,95,116,104,114,101,97,100,115,61,51,32,115,108,105,99,101,100,95,116,104,114,101,97,100,115,61,48,32,110,114,61,48,32,100,101,99,105,109,97,116,101,61,49,32,105,110,116,101,114,108,97,99,101,100,61,48,32,98,108,117,114,97,121,95,99,111,109,112,97,116,61,48,32,99,111,110,115,116,114,97,105,110,101,100,95,105,110,116,114,97,61,48,32,98,102,114,97,109,101,115,61,48,32,119,101,105,103,104,116,112,61,48,32,107,101,121,105,110,116,61,50,53,48,32,107,101,121,105,110,116,95,109,105,110,61,50,53,32,115,99,101,110,101,99,117,116,61,48,32,105,110,116,114,97,95,114,101,102,114,101,115,104,61,48,32,114,99,61,99,113,112,32,109,98,116,114,101,101,61,48,32,113,112,61,48,13,10]},{"type":"Buffer","data":[79,117,116,112,117,116,32,35,48,44,32,109,112,52,44,32,116,111,32,39,111,117,116,112,117,116,46,109,112,52,39,58,13,10,32,32,77,101,116,97,100,97,116,97,58,13,10,32,32,32,32,101,110,99,111,100,101,114,32,32,32,32,32,32,32,32,32,58,32,76,97,118,102,53,57,46,51,53,46,49,48,48,13,10,32,32,83,116,114,101,97,109,32,35,48,58,48,58,32,86,105,100,101,111,58,32,104,50,54,52,32,40,97,118,99,49,32,47,32,48,120,51,49,54,51,55,54,54,49,41,44,32,121,117,118,52,52,52,112,40,116,118,44,32,112,114,111,103,114,101,115,115,105,118,101,41,44,32,49,57,50,48,120,49,48,56,48,44,32,113,61,50,45,51,49,44,32,50,57,46,57,55,32,102,112,115,44,32,51,48,107,32,116,98,110,13,10,32,32,32,32,77,101,116,97,100,97,116,97,58,13,10,32,32,32,32,32,32,101,110,99,111,100,101,114,32,32,32,32,32,32,32,32,32,58,32,76,97,118,99,53,57,46,53,54,46,49,48,48,32,108,105,98,120,50,54,52,13,10,32,32,32,32,83,105,100,101,32,100,97,116,97,58,13,10,32,32,32,32,32,32,99,112,98,58,32,98,105,116,114,97,116,101,32,109,97,120,47,109,105,110,47,97,118,103,58,32,48,47,48,47,48,32,98,117,102,102,101,114,32,115,105,122,101,58,32,48,32,118,98,118,95,100,101,108,97,121,58,32,78,47,65,13,10]},{"type":"Buffer","data":[102,114,97,109,101,61,32,32,32,32,48,32,102,112,115,61,48,46,48,32,113,61,48,46,48,32,115,105,122,101,61,32,32,32,32,32,32,32,48,107,66,32,116,105,109,101,61,45,53,55,55,48,49,52,58,51,50,58,50,50,46,55,55,32,98,105,116,114,97,116,101,61,32,32,45,48,46,48,107,98,105,116,115,47,115,32,115,112,101,101,100,61,78,47,65,32,32,32,32,13]},{"type":"Buffer","data":[102,114,97,109,101,61,32,32,32,32,48,32,102,112,115,61,48,46,48,32,113,61,48,46,48,32,115,105,122,101,61,32,32,32,32,32,32,32,48,107,66,32,116,105,109,101,61,45,53,55,55,48,49,52,58,51,50,58,50,50,46,55,55,32,98,105,116,114,97,116,101,61,32,32,45,48,46,48,107,98,105,116,115,47,115,32,100,117,112,61,49,32,100,114,111,112,61,48,32,115,112,101,101,100,61,78,47,65,32,32,32,32,13]},{"type":"Buffer","data":[102,114,97,109,101,61,32,32,32,49,52,32,102,112,115,61,32,49,51,32,113,61,48,46,48,32,115,105,122,101,61,32,32,32,32,49,48,50,52,107,66,32,116,105,109,101,61,48,48,58,48,48,58,48,48,46,52,54,32,98,105,116,114,97,116,101,61,49,55,57,53,56,46,53,107,98,105,116,115,47,115,32,100,117,112,61,49,32,100,114,111,112,61,48,32,115,112,101,101,100,61,48,46,52,52,52,120,32,32,32,32,13]},{"type":"Buffer","data":[102,114,97,109,101,61,32,32,32,51,48,32,102,112,115,61,32,49,57,32,113,61,48,46,48,32,115,105,122,101,61,32,32,32,32,49,50,56,48,107,66,32,116,105,109,101,61,48,48,58,48,48,58,48,49,46,48,48,32,98,105,116,114,97,116,101,61,49,48,52,55,53,46,55,107,98,105,116,115,47,115,32,100,117,112,61,49,32,100,114,111,112,61,48,32,115,112,101,101,100,61,48,46,54,51,49,120,32,32,32,32,13]},{"type":"Buffer","data":[102,114,97,109,101,61,32,32,32,52,54,32,102,112,115,61,32,50,50,32,113,61,48,46,48,32,115,105,122,101,61,32,32,32,32,49,55,57,50,107,66,32,116,105,109,101,61,48,48,58,48,48,58,48,49,46,53,51,32,98,105,116,114,97,116,101,61,57,53,54,52,46,54,107,98,105,116,115,47,115,32,100,117,112,61,49,32,100,114,111,112,61,48,32,115,112,101,101,100,61,48,46,55,50,53,120,32,32,32,32,13]},{"type":"Buffer","data":[102,114,97,109,101,61,32,32,32,54,50,32,102,112,115,61,32,50,52,32,113,61,48,46,48,32,115,105,122,101,61,32,32,32,32,50,48,52,56,107,66,32,116,105,109,101,61,48,48,58,48,48,58,48,50,46,48,54,32,98,105,116,114,97,116,101,61,56,49,49,48,46,49,107,98,105,116,115,47,115,32,100,117,112,61,50,32,100,114,111,112,61,48,32,115,112,101,101,100,61,48,46,55,56,53,120,32,32,32,32,13]},{"type":"Buffer","data":[102,114,97,109,101,61,32,32,32,55,55,32,102,112,115,61,32,50,53,32,113,61,48,46,48,32,115,105,122,101,61,32,32,32,32,50,53,54,48,107,66,32,116,105,109,101,61,48,48,58,48,48,58,48,50,46,53,54,32,98,105,116,114,97,116,101,61,56,49,54,50,46,55,107,98,105,116,115,47,115,32,100,117,112,61,50,32,100,114,111,112,61,48,32,115,112,101,101,100,61,48,46,56,49,56,120,32,32,32,32,13]},{"type":"Buffer","data":[102,114,97,109,101,61,32,32,32,57,50,32,102,112,115,61,32,50,53,32,113,61,48,46,48,32,115,105,122,101,61,32,32,32,32,50,56,49,54,107,66,32,116,105,109,101,61,48,48,58,48,48,58,48,51,46,48,54,32,98,105,116,114,97,116,101,61,55,53,49,53,46,48,107,98,105,116,115,47,115,32,100,117,112,61,50,32,100,114,111,112,61,48,32,115,112,101,101,100,61,48,46,56,52,50,120,32,32,32,32,13]},{"type":"Buffer","data":[102,114,97,109,101,61,32,32,49,48,56,32,102,112,115,61,32,50,54,32,113,61,48,46,48,32,115,105,122,101,61,32,32,32,32,51,48,55,50,107,66,32,116,105,109,101,61,48,48,58,48,48,58,48,51,46,54,48,32,98,105,116,114,97,116,101,61,54,57,56,51,46,54,107,98,105,116,115,47,115,32,100,117,112,61,50,32,100,114,111,112,61,48,32,115,112,101,101,100,61,48,46,56,54,52,120,32,32,32,32,13]},{"type":"Buffer","data":[102,114,97,109,101,61,32,32,49,50,51,32,102,112,115,61,32,50,54,32,113,61,48,46,48,32,115,105,122,101,61,32,32,32,32,51,56,52,48,107,66,32,116,105,109,101,61,48,48,58,48,48,58,48,52,46,49,48,32,98,105,116,114,97,116,101,61,55,54,54,52,46,57,107,98,105,116,115,47,115,32,100,117,112,61,50,32,100,114,111,112,61,48,32,115,112,101,101,100,61,48,46,56,55,56,120,32,32,32,32,13]},{"type":"Buffer","data":[102,114,97,109,101,61,32,32,49,51,57,32,102,112,115,61,32,50,55,32,113,61,48,46,48,32,115,105,122,101,61,32,32,32,32,52,51,53,50,107,66,32,116,105,109,101,61,48,48,58,48,48,58,48,52,46,54,51,32,98,105,116,114,97,116,101,61,55,54,56,55,46,48,107,98,105,116,115,47,115,32,100,117,112,61,50,32,100,114,111,112,61,48,32,115,112,101,101,100,61,48,46,56,57,50,120,32,32,32,32,13]},{"type":"Buffer","data":[102,114,97,109,101,61,32,32,49,53,53,32,102,112,115,61,32,50,55,32,113,61,48,46,48,32,115,105,122,101,61,32,32,32,32,52,54,48,56,107,66,32,116,105,109,101,61,48,48,58,48,48,58,48,53,46,49,55,32,98,105,116,114,97,116,101,61,55,50,57,57,46,48,107,98,105,116,115,47,115,32,100,117,112,61,50,32,100,114,111,112,61,48,32,115,112,101,101,100,61,48,46,57,48,50,120,32,32,32,32,13]}];
    // let buffer = Buffer.concat(dataList);
    // let blob = new Blob([buffer], { type: 'video/mp4' });
  }
  //url!: string
  changeWatermark(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    console.log(files[0])
    const canvas = this.watermarking.nativeElement;
    const ctx = canvas.getContext('2d');
    // ctx.drawImage(files[0],0,0);
    console.log(window.URL.createObjectURL(files[0]));
    const img = new Image();
    img.src = window.URL.createObjectURL(files[0]);
   
    img.onload = () => {
      canvas.width=img.width;
      canvas.height=img.height;
      console.log(img,img.width,img.height)
      // 平铺水印
      const canvasWater = document.createElement('canvas');
      //const waterMarkSize = 200; // 水印大小
      console.log(canvas.width, canvas.height)
      canvasWater.width = 50;
      canvasWater.height =50;
      const ctxWater = canvasWater.getContext('2d');
      ctxWater!.textAlign = 'left';
      ctxWater!.textBaseline = 'top';
      ctxWater!.font = '12px Microsoft Yahei';
      ctxWater!.fillStyle = '#999';
      ctxWater!.rotate(-20 * Math.PI / 180);
      // ctxWater!.fillText('橙某人', 60, 80);
      ctxWater!.fillText('水印wk', 0, 20);
      // ctxWater!.fillText('2022年11月22日 09:22:30', 10, 100);


      ctx.drawImage(img, 0, 0);
      ctx.fillStyle = ctx.createPattern(canvasWater, 'repeat'); // 绘制重复的水印
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      //console.log(canvas.toDataURL('image/png', 0.8))
      canvas.toDataURL('image/png', 1);
      const blob = new Blob([canvas.toDataURL('image/png', 1)], { type: 'image/png' });
      console.log(URL.createObjectURL(blob));
      //this.url = URL.createObjectURL(blob);
      document.removeChild(canvasWater);

    }





  }
  download1() {
    const a = document.createElement('a');
    a.download = 'my-image.png';
    a.href = this.watermarking.nativeElement.toDataURL('image/png', 1);
    a.click();
    document.removeChild(a);
  }
}

interface WebSocketStatus {
  onopen: boolean,
  onerror: boolean,
  onclose: boolean
}
type GreaterThan<T extends number, U extends number, R extends any[] = []> =
  T extends R['length']
  ? false
  : U extends R['length']
  ? true
  : GreaterThan<T, U, [...R, 1]>



interface language {
  english: () => string
}

const foo = ['a', 'b'] as const
// foo[0]='a'

type K1 = keyof boolean;