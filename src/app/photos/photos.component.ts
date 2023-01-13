import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { fabric } from "fabric";
@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss']
})
export class PhotosComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas') canvasElem!: ElementRef;
  @ViewChild('pElem') pElem!: ElementRef;
  @ViewChild('fupElem') fupElem!: ElementRef;

  constructor() {







  }
  ctx: any
  canvas!: fabric.Canvas


  direction: { top: boolean, bottom: boolean } = { top: true, bottom: false };
  ngAfterViewInit(): void {


    // setInterval(() => {
    //   if (progress == 1) this.direction = { top: false, bottom: true };
    //   if (progress == 0.3) this.direction = { top: true, bottom: false };
    //   this.pElem.nativeElement.style.color = 'transparent';

    //   if (this.direction.top) {
    //     progress = parseFloat((progress + 0.01).toFixed(2))
    //     this.pElem.nativeElement.style.setProperty('--progress', String(progress));
    //     //console.log(progress);
    //   }

    //   if (this.direction.bottom) {
    //     progress = parseFloat((progress - 0.01).toFixed(2))
    //     this.pElem.nativeElement.style.setProperty('--progress', String(progress));

    //     //console.log(progress);
    //   }



    //   //this.pElem.nativeElement.style.color='transparent';
    //   //console.log(progress);
    // }, 80);
    // console.log(this.fupElem.nativeElement)
    //this.pElem.nativeElement.style.color = 'transparent';
    // .sort((a, b) => {
    //   return a - b
    // })

    //.reverse()

    (this.fupElem.nativeElement.childNodes as any[]).forEach((_, index) => {
      console.log(_)

      let progressList: progressList[] = [];
      progressList.push({
        progress: 0,
        index: index
      })
      const time: number = (Math.random() * 200) + index;
      setInterval(() => {

        _.style.color = 'transparent';
        progressList.filter(_ => { return _.index == index })[0].progress = +parseFloat(String(progressList.filter(_ => { return _.index == index })[0].progress + (0.01 + index / 100))).toFixed(2);
        //  progressList=+parseFloat(String(progress + (0.01 + index/100))).toFixed(2);

        _.style.setProperty('--progress', String(progressList.filter(_ => { return _.index == index })[0].progress));
        // //this.pElem.nativeElement.style.setProperty('--progress', String(progress));
      }, time);
      console.log(time)
    })















    this.canvas = new fabric.Canvas('canvas');
    this.canvas.setWidth(500);
    this.canvas.setHeight(500);
    this.canvas.setBackgroundColor('#999', () => undefined);
    this.ctx = this.canvas.getContext();
    //throw new Error('Method not implemented.');

    // this.ctx = this.canvasElem.nativeElement.getContext('2d');
    // // Draw a red rectangle
    // this.ctx.fillStyle = '#999';
    // this.ctx.fillRect(0 ,0, 800, 800);
  }
  Change(event: Event) {
    console.log(event);
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    for (let index = 0; index < files.length; index++) {
      console.log(URL.createObjectURL(files[index]));
      this.drawImage(URL.createObjectURL(files[index]));
    }
    console.log(files[0], typeof files)



  }
  imgList: Array<any> = []
  Change1(event: Event) {
    console.log(event);
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    for (let index = 0; index < files.length; index++) {
      console.log(URL.createObjectURL(files[index]));
      this.imgList.push(this.getAverageColor(URL.createObjectURL(files[index])))
    }
    console.log('aaa', this.imgList)



  }
  //绘制目标图片
  drawImage(url: string) {


    fabric.Image.fromURL(url, (img) => {
      this.canvas.setWidth(img.width!);
      this.canvas.setHeight(img.height!);
      console.log(img)
      //设置缩放比例,长图的缩放比为this.canvas.width / img.width,宽图的缩放比为this.canvas.height / img.height
      let scaleX = img!.height! > img!.width!
        ? this.canvas.width! / img!.width!
        : this.canvas.width! / img!.width!;
      let scaleY = img!.height! > img!.width!
        ? this.canvas.width! / img!.width!
        : this.canvas.height! / img!.height!;
      console.log(img.width, img.height, this.canvas.width, this.canvas.height)
      // img.width=this.canvas.width;
      // img.height=this.canvas.height;
      console.log(scaleX, scaleY)
      img.set({
        // left: 0, //距离左边的距离
        // originX: "center", //图片在原点的对齐方式
        // top: 0,
        // scaleX: 1/1,// 横向缩放
        // scaleY: 1/1, //纵向缩放
        selectable: false, //可交互
      });
      // Create a new Fabric.js this.canvas and get a reference to its 2D rendering context

      //   img.on("added", (e) => {
      //     //这里有个问题,added后获取的是之前的画布像素数据,其他手动触发的事件,不会有这种问题
      //     //故用一个异步解决
      //     setTimeout(() => {
      //         this.getthis.canvasData();
      //     }, 500);
      // });
      this.canvas.add(img);
      //canvas.add(new fabric.Line([0, 0, 100, 100], { stroke: 'red' }));
      this.drawLine(this.canvas, img);
      setTimeout(() => {
        this.getCanvasData();
      }, 5000);



    })
  }
  drawLine(canvas: any, img: fabric.Image) {
    //const canvas = new fabric.Canvas('canvas');
    const blockPixel = 10;
    for (let i = 0; i <= canvas.width / blockPixel; i++) {
      canvas.add(
        new fabric.Line([i * blockPixel, 0, i * blockPixel, canvas.width!], {
          left: i * blockPixel,
          stroke: "gray",
          selectable: false, //是否可被选中
        })
      );
      canvas.add(
        new fabric.Line([0, i * blockPixel, canvas.width!, i * blockPixel], {
          top: i * blockPixel,
          stroke: "gray",
          selectable: false, //是否可被选中
        })
      );
    }
  }
  //获取画布像素数据
  getCanvasData() {
    var blockList: Array<any> = []
    for (let Y = 0; Y < this.canvas.height! / 10; Y++) {
      for (let X = 0; X < this.canvas.width! / 10; X++) {
        //每8*8像素的一块区域一组
        let tempColorData = this.ctx.getImageData(X * 10, Y * 10, 10, 10).data;
        //将获取到数据每4个一组,每组都是一个像素
        console.log(tempColorData)
        //blockList=tempColorData;
        blockList[Y * 100 + X] = { position: [X, Y], color: [] };
        for (let i = 0; i < tempColorData.length; i += 4) {
          blockList[Y * 100 + X].color.push([
            tempColorData[i],
            tempColorData[i + 1],
            tempColorData[i + 2],
            tempColorData[i + 3],
          ]);
        }
      }
    }

    // console.log(mostBlockColor(this.blockList));
    this.mostBlockColor(blockList, (data: Array<any>) => this.generateImg(data));//获取每个小块的主色调
    // this.loading = false;
  }
  //获取每个格子的主色调
  mostBlockColor(blockList: any[], callback: (blockMainColors: Array<any>) => void | undefined) {
    //所有颜色的平均值为主色调
    var blockMainColors: Array<any> = [];//每个格子的主色调
    console.log(blockList, 'blockList')
    blockList.forEach(_ => {
      let r = 0,
        g = 0,
        b = 0,
        a = 0
      for (let j = 0; j < _?.color[j].length; j++) {
        r += _?.color[j][0]
        g += _?.color[j][1]
        b += _?.color[j][2]
        a += _?.color[j][3]
      }

      // 求取平均值
      r /= _.color[0].length
      g /= _.color[0].length
      b /= _.color[0].length
      a /= _.color[0].length
      // 将最终的值取整
      r = Math.round(r)
      g = Math.round(g)
      b = Math.round(b)
      a = Math.round(a)
      blockMainColors.push({
        position: _.position,
        color: [r, g, b, a],
      })
    })
    console.log(blockMainColors)
    callback(blockMainColors)
  }
  colorDiff(color1: any, color2: any) {
    let d = 0
    for (let i = 0; i < color1.length; i++) {
      d += (color1[i] ?? 0 - color2[i] ?? 0) ** 2
    }
    return Math.sqrt(d);
  }
  //生成图片
  generateImg(blockMainColors: Array<any>) {
    console.log(this.imgList)
    let diffColorList: Array<any> = []
    //遍历所有方块
    for (let i = 0; i < blockMainColors.length; i++) {
      diffColorList[i] = { diffs: [] }
      //遍历所有图片
      for (let j = 0; j < this.imgList.length; j++) {
        console.log(this.imgList[j].url, 'ddda')
        diffColorList[i].diffs.push({
          url: this.imgList[j].url,
          diff: this.colorDiff(
            blockMainColors[i].color,
            this.imgList[j].color,
          ),
          color: this.imgList[j].color,
        })
      }

      //对比较过的图片进行排序,差异最小的放最前面
      // diffColorList[i].diffs.sort((a, b) => {
      //   return a.diff - b.diff
      // })

      //取第0个图片信息
      diffColorList[i].url = diffColorList[i].diffs[Math.floor((Math.random() * this.imgList.length) + 0)].url
      diffColorList[i].position = blockMainColors[i].position
      diffColorList[i].Acolor = blockMainColors[i].color
      diffColorList[i].Bcolor = diffColorList[i].diffs[0].color
    }


    console.log(diffColorList, 'ddd')
    //便利每一个方块,对其渲染
    diffColorList.forEach((item) => {
      if (item.url != diffColorList[0].url) {
        console.log(item, 'sss')
      }

      fabric.Image.fromURL(item.url, (img) => {
        let scale = img.height! > img.width! ? 10 / img.width! : 10 / img.height!
        // img.scale(8 / img.height);
        img.set({
          left: item.position[0] * 10,
          top: item.position[1] * 10,
          originX: 'center',
          scaleX: scale,
          scaleY: scale,
        })
        this.canvas.add(img)
      })
    })
  }
  /* eslint-disable */
  getAverageColor(imgUrl: string) {
    const canvas = document.createElement('canvas')
    // 设置canvas的宽高都为20,越小越快,但是越小越不精确
    canvas.width = 1000
    canvas.height = 1000
    const img = new Image() // 创建img元素
    img.src = imgUrl // 设置图片源地址
    var r = 0
    let g = 0
    let b = 0
    let a = 0
    img.onload = () => {
      console.log(img.width, img.height)
      const ctx = canvas.getContext('2d')!
      const scaleH = canvas.height / img.height
      img.height = canvas.height
      img.width *= scaleH
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      // 获取像素数据
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)

      // 取所有像素的平均值
      for (let row = 0; row < canvas.height; row++) {
        for (let col = 0; col < canvas.width; col++) {
          r += data[(canvas.width * row + col) * 4]
          g += data[(canvas.width * row + col) * 4 + 1]
          b += data[(canvas.width * row + col) * 4 + 2]
          a += data[(canvas.width * row + col) * 4 + 3]
        }
      }
      // 求取平均值
      r /= canvas.width * canvas.height
      g /= canvas.width * canvas.height
      b /= canvas.width * canvas.height
      a /= canvas.width * canvas.height

      // 将最终的值取整
      r = Math.round(r)
      g = Math.round(g)
      b = Math.round(b)
      a = Math.round(a)
      console.log(
        `%c ${`rgba(${r},${g},${b},${a})`}
                                                                      `,
        `background: ${`rgba(${r},${g},${b},${a})`};`,
      )

      // resolve()

    }
    return { color: [r, g, b, a], url: imgUrl }

  }

  ngOnInit(): void {

  }

}
type progressList = {
  progress: number,
  index: number
}