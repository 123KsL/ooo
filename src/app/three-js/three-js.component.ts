import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';//方式 1: 导入整个 three.js核心库
import { Vector3, Mesh } from 'three';

import { DragControls } from 'node_modules/three/examples/jsm/controls/DragControls.js';
// 方式 2: 仅导入你所需要的部分
//import { Scene } from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TextGeometry } from 'node_modules/three/examples/jsm/geometries/TextGeometry.js';
import { OrbitControls } from 'node_modules/three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'node_modules/three/examples/jsm/loaders/FontLoader.js';
// import { FontLoader } from 'node_modules/three/examples/jsm/loaders/FontLoader.js';
import { GLTFLoader } from 'node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'node_modules/three/examples/jsm/loaders/OBJLoader.js';
import { cloneDeep } from 'lodash';

import * as TWEEN from '@tweenjs/tween.js'

import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as BufferGeometryUtils from 'node_modules/three/examples/jsm/utils/BufferGeometryUtils.js';


@Component({
  selector: 'app-three-js',
  templateUrl: './three-js.component.html',
  styleUrls: ['./three-js.component.scss']
})
export class ThreeJsComponent implements OnInit {
  @ViewChild('threeScene', { static: true }) threeScene!: ElementRef;
  @ViewChild('threeScene_box', { static: true }) threeScene_box!: ElementRef;
  @ViewChild('wsx', { static: true }) wsx!: ElementRef;

  //{ static: true }表示元素应该在静态检查期间就解析，而不是在变更检测期间解析。因此ngOnInit可以拿到
  constructor() { }
  FromGroup!: FormGroup;
  ngOnInit(): void {
    this.FromGroup = new FormGroup({
      x: new FormControl<number | null>(5, {
        validators: [Validators.required],
        updateOn: 'change'
      }),
      y: new FormControl<number | null>(5, {
        validators: [Validators.required],
        updateOn: 'change'
      }),
      z: new FormControl<number | null>(3, {
        validators: [Validators.required],
        updateOn: 'change'
      }),
      d: new FormControl<number | null>(2.5, {
        validators: [Validators.required],
        updateOn: 'change'
      }),
      luck: new FormControl<number | null>(1.5, {
        validators: [Validators.required],
        updateOn: 'change'
      })
    })
    //this.CreateBox();
    this.ConfirmBox();
    this.Two();
  }
  ddddd() {

    // 获取第一个子元素
    const firstChild = this.threeScene_box.nativeElement.firstChild;

    // 删除第一个子元素
    this.threeScene_box.nativeElement.removeChild(firstChild);

    // console.log(this.threeScene_box.nativeElement);
    this.ConfirmBox();

  }
  Confirm() {



    // 获取第一个子元素
    const firstChild = this.threeScene_box.nativeElement.firstChild;
    const firstChild1 = this.wsx.nativeElement.firstChild;
    // 删除第一个子元素
    this.threeScene_box.nativeElement.removeChild(firstChild);
    this.wsx.nativeElement.removeChild(firstChild1);
    // console.log(this.threeScene_box.nativeElement);
    this.ConfirmBox();
    this.Two();
    //this.Three();
  }
  front_example;
  Two() {
    //let cameraControls;
    const scene = new THREE.Scene();//场景

    const camera = new THREE.PerspectiveCamera(
      75, this.wsx.nativeElement.clientWidth / this.wsx.nativeElement.clientHeight, 0.1, 1000
      //45, window.innerWidth / window.innerHeight, 1, 500
    ); //相机

    const renderer = new THREE.WebGLRenderer({ antialias: true }); //渲染器
    renderer.setSize(this.wsx.nativeElement.clientWidth, this.wsx.nativeElement.clientHeight);
    (this.wsx.nativeElement as HTMLDivElement).appendChild(renderer.domElement);
    renderer.setClearColor('#000');
    scene.background = new THREE.Color('#999')
    // 添加环境光源
    const ambientLight = new THREE.AmbientLight('white', 0.5); // 白色环境光
    scene.add(ambientLight);

    // 添加平行光源
    const directionalLight = new THREE.DirectionalLight('white', 1); // 白色平行光
    directionalLight.position.set(5, 10, 7); // 设置光源位置
    scene.add(directionalLight);


    const gridHelper = new THREE.GridHelper(10, 10, 'green', 'black');
    scene.add(gridHelper)    //网格地面

    const axesHelper = new THREE.AxesHelper(5); //坐标
    scene.add(axesHelper);

    const box = {
      w: this.FromGroup.value.x,
      h: this.FromGroup.value.y,
      z: this.FromGroup.value.z,
      d: this.FromGroup.value.d,
      luck: this.FromGroup.value.luck
    }

    const boxSetting = [
      'front', 'left', 'top', 'dust_flap'
    ]
    const group = new THREE.Group();//组

    boxSetting.forEach(_ => {
      switch (_) {
        case 'left': {
          const geometry = new THREE.PlaneGeometry(box.h, box.z);
          const material = new THREE.MeshBasicMaterial({ color: 'red', side: THREE.DoubleSide });
          [0, 1].forEach(_ => {

            const plane = new THREE.Mesh(geometry, material);
            plane.position.set(_ == 0 ? -box.h / 2 - box.w : (box.h / 2), 0, 0);
            group.add(plane);
            if (_ == 0) {
              this.front_example = plane;
            }

          })

          break;
        }
        case 'front': {
          // 加载纹理贴图
          const textureLoader = new THREE.TextureLoader();
          const texture = textureLoader.load('assets/images/person.png');
          const geometry = new THREE.PlaneGeometry(box.w, box.z);
          const material = new THREE.MeshBasicMaterial({ map: texture, color: 'blue', side: THREE.DoubleSide });
          [0, 1].forEach(_ => {
            const plane = new THREE.Mesh(geometry, material);
            plane.position.set(_ == 0 ? -box.w / 2 : box.h + box.w / 2, 0, 0);
            group.add(plane);
          })
          // const plane = new THREE.Mesh(geometry, material);
          // plane.position.set(- box.w, 0, 0);
          // group.add(plane);
          break;
        }

        case 'top': {
          const geometry = new THREE.PlaneGeometry(box.w, box.h);
          const material = new THREE.MeshBasicMaterial({ color: 'green', side: THREE.DoubleSide });


          [0, 1].forEach(_ => {
            const plane = new THREE.Mesh(geometry, material);
            plane.position.set(box.h + box.w / 2, _ == 0 ? box.z / 2 + box.h / 2 : -box.z / 2 - box.h / 2, 0);
            group.add(plane);
          })

          break;
        }
        case 'dust_flap': {
          //, ''
          ['top_left', 'top_right', 'bottom_left', 'bottom_right', 'top_luck', 'hidden'].forEach(direction => {
            // 创建梯形形状
            const shape = new THREE.Shape();
            shape.moveTo(0, 0); // 左下角顶点
            shape.lineTo(box.h, 0);  // 右下角顶点
            shape.lineTo(box.h, box.d * 0.3); // 右上角顶点
            shape.lineTo(box.h - box.d * 0.3, box.d); // 右上角顶点 // 右上角顶点
            shape.lineTo(0, box.d); // 左上角顶点
            shape.lineTo(0, 0); // 回到起点
            // 创建梯形几何体
            const extrudeSettings = {
              steps: 1,
              depth: 0.5,
              bevelEnabled: false,
            };

            if (direction == 'top_left') {
              const geometry = new THREE.ShapeGeometry(shape);
              const material = new THREE.MeshBasicMaterial({ color: 'black', side: THREE.DoubleSide, transparent: false });
              const mesh = new THREE.Mesh(geometry, material);
              mesh.position.set(-box.w - box.h, box.z / 2, 0);
              group.add(mesh);
            } else if (direction == 'top_right') {
              const geometry = new THREE.ShapeGeometry(shape);
              const material = new THREE.MeshBasicMaterial({ color: 'black', side: THREE.DoubleSide, transparent: false });
              const mesh = new THREE.Mesh(geometry, material);
              mesh.scale.setY(-1);

              mesh.position.set(-box.w - box.h, -box.z / 2, 0);
              group.add(mesh);
            }
            else if (direction == 'bottom_left') {
              const geometry = new THREE.ShapeGeometry(shape);
              const material = new THREE.MeshBasicMaterial({ color: 'black', side: THREE.DoubleSide, transparent: false });
              const mesh = new THREE.Mesh(geometry, material);
              // mesh.scale.setY(1);
              mesh.scale.setX(-1);
              mesh.scale.setY(-1);
              mesh.position.set(box.h, -box.z / 2, 0);
              group.add(mesh);
            }
            else if (direction == 'bottom_right') {
              const geometry = new THREE.ShapeGeometry(shape);
              const material = new THREE.MeshBasicMaterial({ color: 'black', side: THREE.DoubleSide, transparent: false });
              const mesh = new THREE.Mesh(geometry, material);
              mesh.scale.setX(-1);
              mesh.position.set(box.h, box.z / 2, 0);
              group.add(mesh);
            }
            else if (direction == 'top_luck') {
              //top_luck
              // 创建梯形形状
              const shape = new THREE.Shape();
              shape.moveTo(0, 0); // 左下角顶点
              shape.lineTo(box.w, 0);  // 右下角顶点
              shape.lineTo(box.w, box.luck * 0.5); // 右上角顶点
              shape.lineTo(box.w - box.luck * 0.5, box.luck); // 左上角顶点
              shape.lineTo(box.luck * 0.5, box.luck);
              shape.lineTo(0, box.luck * 0.5);
              shape.lineTo(0, 0); // 回到起点
              // 创建梯形几何体
              const extrudeSettings = {
                steps: 1,
                depth: 0.5,
                bevelEnabled: false,
              };


              ['top', 'bottom'].forEach(_ => {
                if (_ == 'top') {
                  const geometry = new THREE.ShapeGeometry(shape);
                  const material = new THREE.MeshBasicMaterial({ color: 'black', side: THREE.DoubleSide, transparent: false });
                  const mesh = new THREE.Mesh(geometry, material);
                  mesh.position.set(box.h, box.h + box.z / 2, 0);
                  group.add(mesh);
                } else {
                  const geometry = new THREE.ShapeGeometry(shape);
                  const material = new THREE.MeshBasicMaterial({ color: 'black', side: THREE.DoubleSide, transparent: false });
                  const mesh = new THREE.Mesh(geometry, material);
                  mesh.scale.setY(-1);
                  mesh.position.set(box.h, -box.h - box.z / 2, 0);
                  group.add(mesh);

                }

              })


            } else {
              // 创建梯形形状
              const shape = new THREE.Shape();
              shape.moveTo(0, 0); // 左下角顶点
              shape.lineTo(0, box.z);  // 右下角顶点
              shape.lineTo(box.luck, box.z - box.luck * 0.5);
              shape.lineTo(box.luck, box.luck * 0.5); // 左
              // shape.lineTo(box.w, box.luck * 0.5); // 右上角顶点
              //上角顶点

              // shape.lineTo(0, box.luck * 0.5);
              shape.lineTo(0, 0); // 回到起点
              // 创建梯形几何体
              const extrudeSettings = {
                steps: 1,
                depth: 0.5,
                bevelEnabled: false,
              };
              const geometry = new THREE.ShapeGeometry(shape);
              const material = new THREE.MeshBasicMaterial({ color: 'black', side: THREE.DoubleSide, transparent: false });
              const mesh = new THREE.Mesh(geometry, material);
              mesh.position.set(box.h + box.w, -box.z / 2, 0);
              group.add(mesh);
            }
          });
          // 'bottom_top_luck_left', 'bottom_top_luck_right'
          // [].forEach(direction => {
          //   const shape = new THREE.Shape();
          //   // shape.moveTo(0, 0); // 左下角顶点
          //   shape.lineTo(0, box.h / 2);  // 右下角顶点
          //   shape.lineTo(box.d, box.h / 2);  // 右下角顶点
          //   shape.lineTo(box.d, -box.h / 2 + box.h * 0.3); // 右上角顶点
          //   shape.lineTo(0, -box.h / 2); // 左上角顶点
          //   shape.lineTo(0, box.h / 2);  // 右下角顶点

          //   if (direction == 'bottom_top_luck_left') {
          //     // 创建梯形形状

          //     // 创建梯形几何体
          //     const extrudeSettings = {
          //       steps: 1,
          //       depth: 0.5,
          //       bevelEnabled: false,
          //     };
          //     const geometry = new THREE.ShapeGeometry(shape);
          //     const material = new THREE.MeshBasicMaterial({ color: 'black', side: THREE.DoubleSide, transparent: false });
          //     const mesh = new THREE.Mesh(geometry, material);
          //     mesh.rotation.x = -Math.PI / 2;


          //     mesh.position.set(-box.w / 2, -box.z / 2, 0);


          //     // mesh.matrix.setPosition(-box.w/2,box.h/2,0)
          //     // mesh.updateMatrixWorld(); // 更新对象的世界矩阵
          //     group.add(mesh);
          //   } else if (direction == 'bottom_top_luck_right') {
          //     // 创建梯形形状
          //     const geometry = new THREE.ShapeGeometry(shape);
          //     const material = new THREE.MeshBasicMaterial({ color: 'black', side: THREE.DoubleSide, transparent: false });
          //     const mesh = new THREE.Mesh(geometry, material);
          //     mesh.rotation.x = Math.PI / 2;
          //     mesh.rotation.z = -Math.PI;

          //     // mesh.rotation.y = Math.PI / 2;
          //     // mesh.rotation.z = Math.PI / 1;
          //     //mesh.position.set(box.w / 2, box.z / 2, -box.h / 2);
          //     // mesh.matrix.setPosition(-box.w/2,box.h/2,0)
          //     mesh.position.set(box.w / 2, -box.z / 2, 0);
          //     //mesh.updateMatrixWorld(); // 更新对象的世界矩阵
          //     group.add(mesh);
          //   }
          // });

          break;
        }
        default: {
          break;
        }
      }

    })

    const group1 = new THREE.Group();//组




    // const geometry = new THREE.PlaneGeometry(5, 5);
    // const wireframeGeometry = new THREE.WireframeGeometry(geometry); // 仅边的几何体

    // const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

    // const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial); // 使用LineSegments来显示边

    // 创建一个平面几何体
    const geometry = new THREE.PlaneGeometry(5, 5);

    // 创建一个透明贴图，只有边缘是不透明的，其他区域是透明的
    const textureSize = 512;
    const canvas = document.createElement('canvas');
    canvas.width = textureSize;
    canvas.height = textureSize;
    const ctx = canvas.getContext('2d');
    ctx!.fillStyle = 'transparent';
    ctx!.fillRect(0, 0, textureSize, textureSize);
    ctx!.strokeStyle = 'black';
    ctx!.lineWidth = 2;
    ctx!.strokeRect(1, 1, textureSize - 2, textureSize - 2);


    const texture = new THREE.CanvasTexture(canvas);
    //const texture = new THREE.TextureLoader().load('assets/images/22.webp');
    // 创建材质并应用贴图到平面上
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const plane = new THREE.Mesh(geometry, material);
    const controls = new DragControls([plane], camera, renderer.domElement);

    // add event listener to highlight dragged objects
    controls.addEventListener('drag', event => {
      // const object = event.object;
      // const minX = -10; // 设置移动范围的最小X坐标
      // const maxX = 10;  // 设置移动范围的最大X坐标
      // const minY = -10; // 设置移动范围的最小Y坐标
      // const maxY = 10;  // 设置移动范围的最大Y坐标
      // // 限制平面的移动范围
      // object.position.x = THREE.MathUtils.clamp(object.position.x, minX, maxX);
      // object.position.y = THREE.MathUtils.clamp(object.position.y, minY, maxY);

      // // 设置超出范围时的可见性
      // object.visible = object.position.x >= minX && object.position.x <= maxX &&
      //   object.position.y >= minY && object.position.y <= maxY;

      // 获取平面的范围坐标
      //const bounds = getPlaneBounds(this.front_example);
      const bounds1 = {
        minX: -box.w - box.h,
        maxX: -box.w,
        minY: -box.z / 2,
        maxY: box.z / 2,
      };
      const boundsAa = {

        x: -7.5,
        y: 0,
        z: 0,
      };

      // 已有的两个平面的范围坐标
      // const bounds1 = {
      //   minX: bounds_1.maxX,
      //   maxX: 2.5,
      //   minY: -2.5,
      //   maxY: 2.5,
      // };

      //const bounds2 = getPlaneBounds(plane);
      const bounds2 = {
        minX: -12.5,
        maxX: -7.5,
        minY: -2.5,
        maxY: 2.5,
      }
     
      // 获取平面 A 的范围坐标

      // 获取平面 A 的范围坐标


      // 以平面 A 的中心为原点，将平面 B 的坐标转换到平面 A 的坐标系下

      // 计算平面 A 的中心点
      const centerA = new THREE.Vector3(
        -7.5,
        -box.z / 2,
        0
      );
      function transformBoundsToLocalCoord(bounds, centerA) {
        const transformedBounds = {
          minX: Number(bounds.minX) - Number(centerA.x),
          maxX: Number(bounds.maxX) - Number(centerA.x),
          minY: Number(bounds.minY) - Number(centerA.y),
          maxY: Number(bounds.maxY) - Number(centerA.y),
        };
        console.log(bounds.minX, centerA.x, bounds.minX - centerA.x,'bounds.minX - centerA.x');
        return transformedBounds;
      }

      // 将平面 B 的坐标转换到平面 A 的坐标系下
      // const transformedBounds2 = transformBoundsToLocalCoord(bounds2, boundsAa)
      const transformedBounds2 = transformBoundsToLocalCoord(getPlaneBounds(plane), boundsAa);
      
      const transformedBounds23 = transformBoundsToLocalCoord(bounds1, boundsAa);

      
      console.log(transformBoundsToLocalCoord(bounds2, boundsAa), 'boundsAa');
      // 计算交集范围
      const intersectionRange = {
        minX: Math.max(transformedBounds23.minX, transformedBounds2.minX),
        maxX: Math.min(transformedBounds23.maxX, transformedBounds2.maxX),
        minY: Math.max(transformedBounds23.minY, transformedBounds2.minY),
        maxY: Math.min(transformedBounds23.maxY, transformedBounds2.maxY),
      };

      // 判断是否存在交集
      const hasIntersection = intersectionRange.minX <= intersectionRange.maxX &&
        intersectionRange.minY <= intersectionRange.maxY;

      console.log('交集范围:', intersectionRange);
      console.log('是否存在交集:', hasIntersection);
this.intersectionRange_front=intersectionRange;


    });

    controls.addEventListener('dragstart', (event) => {
      //console.log('dragstart', event);
      // 获取平面1和平面2的顶点坐标
      // const vertices1 = this.front_example.geometry.getAttribute('position');;
      // const vertices2 = plane.geometry.getAttribute('position');



    });
    // 获取平面的范围坐标
    function getPlaneBounds(plane_value) {
      const geometry = plane_value.geometry;
      const positionAttribute = geometry.getAttribute('position');

      let minX = Number.POSITIVE_INFINITY;
      let maxX = Number.NEGATIVE_INFINITY;
      let minY = Number.POSITIVE_INFINITY;
      let maxY = Number.NEGATIVE_INFINITY;

      for (let i = 0; i < positionAttribute.count; i++) {
        const vertex = new THREE.Vector3().fromBufferAttribute(positionAttribute, i);
        vertex.applyMatrix4(plane.matrixWorld); // 将顶点坐标变换到世界坐标系
        minX = Math.min(minX, vertex.x);
        maxX = Math.max(maxX, vertex.x);
        minY = Math.min(minY, vertex.y);
        maxY = Math.max(maxY, vertex.y);
      }

      return { minX, maxX, minY, maxY };
    }



    // controls.addEventListener('dragend', function (event) {
    //   const uv = new THREE.Vector2();
    //   const intersects = event.intersections;


    //   // event.object.material.emissive.set(0x000000);

    // });
    // controls.addEventListener('hoveron', function (event) {
    //   console.log(event, 'hoveron');
    //   // event.object.material.emissive.set(0x000000);

    // });
    // controls.addEventListener('hoveroff', function (event) {
    //   console.log(event, 'hoveroff');
    //   //event.object.material.emissive.set(0x000000);
    // });

    // 鼠标移动事件，用于获取每个面的 UV 坐标
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    let selectedMesh;

    // function onMouseMove(event) {
    //   // event.preventDefault();

    //   // mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    //   // mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    //   // raycaster.setFromCamera(mouse, camera);

    //   // const intersects = raycaster.intersectObjects([plane]); // 检查与哪个对象相交

    //   // if (intersects.length > 0) {
    //   //   console.log(intersects);


    //   // }
    // }

    // document.addEventListener('mousemove', onMouseMove, false);
    // 创建纹理并应用到整个 Group
    const texture1 = new THREE.TextureLoader().load('assets/images/22.webp');
    // texture1.wrapS = THREE.RepeatWrapping;
    // texture1.wrapT = THREE.RepeatWrapping;

    // texture1.repeat.set(2, 2); // 做一个平铺效果
    // texture1.offset.set(0.5, 0.5); // 将纹理的中心放在模型的中心
    // const materialGroup = new THREE.MeshBasicMaterial({ map: texture1, side: THREE.DoubleSide, transparent: false });




    group1.add(plane);


    // 创建一个空的 BufferGeometry 数组来存储要合并的几何体
    const geometriesToMerge: any[] = [];

    group.traverse(child => {
      if (child instanceof THREE.Mesh) {
        const childGeometry = child.geometry.clone();
        childGeometry.applyMatrix4(child.matrix);
        geometriesToMerge.push(childGeometry);
      }
    });

    // // 使用 BufferGeometryUtils.mergeBufferGeometries 函数合并几何体
    // const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometriesToMerge);

    // // 创建一个材质
    // const material = new THREE.MeshBasicMaterial({ map: texture1, side: THREE.DoubleSide, transparent: false });

    // // 创建合并后的 Mesh
    // const mergedMesh = new THREE.Mesh(mergedGeometry, material);

    // 添加合并后的 Mesh 到场景
    //scene.add(mergedMesh);


    scene.add(group);
    scene.add(group1);

    // const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(0, 0, 25); // 调整相机位置
    // this.camera.position.set(0, 10, 10);
    camera.fov = 60; // 调整视野
    camera.updateProjectionMatrix(); // 更新投影矩阵
    // controls.update();

    function animate() {

      requestAnimationFrame(animate);
      // required if controls.enableDamping or controls.autoRotate are set to true
      // controls.update();
      renderer.render(scene, camera);
    }
    animate()
  }


  photo() {
    // const imageInput = document.createElement('input');
    // const canvas = document.createElement('canvas');
    // const ctx = canvas!.getContext('2d');

    // imageInput.addEventListener('change', event => {
    //   const file = event.target.files[0];
    //   if (file) {
    //     const reader = new FileReader();
    //     reader.onload = function (e) {
    //       const img = new Image();
    //       img.onload = function () {
    //         canvas.width = img.width;
    //         canvas.height = img.height;
    //         ctx.drawImage(img, 0, 0, img.width, img.height);
    //       };
    //       img.src = e.target.result;
    //     };
    //     reader.readAsDataURL(file);
    //   }
    // });

  }
  intersectionRange_front;
  CloseMesh: any[] = [];
  camera;
  renderer = new THREE.WebGLRenderer({ antialias: true }); //渲染器
  scene = new THREE.Scene();//场景
  ConfirmBox() {
    //let cameraControls;
    // const scene = new THREE.Scene();//场景

    this.camera = new THREE.PerspectiveCamera(
      75, this.threeScene_box?.nativeElement.clientWidth / this.threeScene_box?.nativeElement.clientHeight, 1, 1000
      //45, window.innerWidth / window.innerHeight, 1, 500
    ); //相机


    this.renderer.setSize(this.threeScene_box.nativeElement.clientWidth, this.threeScene_box.nativeElement.clientHeight);
    (this.threeScene_box.nativeElement as HTMLDivElement).appendChild(this.renderer.domElement);

    // 添加环境光源
    const ambientLight = new THREE.AmbientLight('white', 0.5); // 白色环境光
    this.scene.add(ambientLight);

    // 添加平行光源
    const directionalLight = new THREE.DirectionalLight('white', 1); // 白色平行光
    directionalLight.position.set(5, 10, 7); // 设置光源位置
    this.scene.add(directionalLight);


    //网格地面
    const gridHelper = new THREE.GridHelper(10, 10, 'green', 'black');

    //gridHelper.material.opacity=0.2;
    //gridHelper.material.
    this.scene.add(gridHelper)

    const axesHelper = new THREE.AxesHelper(5); //坐标
    this.scene.add(axesHelper);

    const box = {
      w: this.FromGroup.value.x,
      h: this.FromGroup.value.y,
      z: this.FromGroup.value.z,
      d: this.FromGroup.value.d,
      luck: this.FromGroup.value.luck
    }

    const boxSetting = [
      'front', 'left', 'top', 'dust_flap'
    ]

    const group = new THREE.Group();//组

    boxSetting.forEach(_ => {
      switch (_) {
        case 'left': {
          [0, 1].forEach(_ => {
            if (_ == 0) {
              const textureLoader = new THREE.TextureLoader();
              const texture = textureLoader.load('assets/images/person.png');
           
              const geometry = new THREE.PlaneGeometry(box.h, box.z);
              const material = new THREE.MeshBasicMaterial({ map: texture,color: 'red', side: THREE.DoubleSide, transparent: false });
              const plane = new THREE.Mesh(geometry, material);
              plane.position.set(_ == 0 ? -box.w / 2 : box.w / 2, 0, 0);

              plane.rotation.x = -Math.PI / 2;
              plane.rotation.y = -Math.PI / 2;
              plane.rotation.z = -Math.PI / 2;


              if (this.intersectionRange_front) {
                // 获取 PlaneGeometry 的 UV 坐标属性
                const uvAttribute = geometry.attributes['uv'];
                // 计算 UV 坐标范围
                const uRange = this.intersectionRange_front.maxX - this.intersectionRange_front.minX;
                const vRange = this.intersectionRange_front.maxY - this.intersectionRange_front.minY;

                // 设置 UV 坐标
                for (let i = 0; i < uvAttribute.count; i++) {
                  const u = (uvAttribute.getX(i) - this.intersectionRange_front.minX) / uRange;
                  const v = (uvAttribute.getY(i) - this.intersectionRange_front.minY) / vRange;

                  uvAttribute.setXY(i, u, v);
                }

                // 更新几何体的 UV 坐标属性
                uvAttribute.needsUpdate = true;
              }
              group.add(plane);
            } else {
              const geometry = new THREE.PlaneGeometry(box.h, box.z);
              const material = new THREE.MeshBasicMaterial({ color: 'red', side: THREE.DoubleSide, transparent: false });
              const plane = new THREE.Mesh(geometry, material);
              plane.position.set(_ == 0 ? -box.w / 2 : box.w / 2, 0, 0);

              plane.rotation.x = -Math.PI / 2;
              plane.rotation.y = -Math.PI / 2;
              plane.rotation.z = -Math.PI / 2;
              group.add(plane);
            }

            // this.GroupList.push({ plane: plane, coordinate: _ == 0 ? [(box.h / 2), 0, box.w] : [(box.h / 2), 0, 0] })


          })

          break;
        }
        case 'front': {
          // 加载纹理贴图
          const textureLoader = new THREE.TextureLoader();
          const texture = textureLoader.load('assets/images/person.png');
          texture.repeat.set(0.25, 1);
          [0, 1].forEach(_ => {
            if (_ == 0) {
              const geometry = new THREE.PlaneGeometry(box.w, box.z);
              const material = new THREE.MeshBasicMaterial({ map: texture, color: 'blue', side: THREE.DoubleSide, transparent: false });
              const plane = new THREE.Mesh(geometry, material);
              plane.position.set(0, 0, -box.h / 2);
              group.add(plane);



            


            } else {
              const geometry = new THREE.PlaneGeometry(box.w, box.z);
              const material = new THREE.MeshBasicMaterial({ map: texture, color: 'blue', side: THREE.DoubleSide, transparent: false });
              const plane = new THREE.Mesh(geometry, material);
              plane.position.set(0, 0, box.h / 2);
              group.add(plane);
            }

          })
          break;
        }
        case 'top': {

          [0, 1].forEach(_ => {
            if (_ == 0) {
              const geometry = new THREE.PlaneGeometry(box.w, box.h);
              const material = new THREE.MeshBasicMaterial({ color: 'green', side: THREE.DoubleSide, transparent: false });
              const plane = new THREE.Mesh(geometry, material);
              plane.position.set(0, box.z / 2 + box.h / 2, -box.h / 2);

              // 获取几何体的顶点属性
              const positionAttribute = geometry.getAttribute('position');
              // 创建一个旋转矩阵，绕X轴旋转 Math.PI / 4 弧度
              // const rotationMatrix = new THREE.Matrix4().makeRotationX(-Math.PI / 4);

              // // 修改顶点位置
              // for (let i = 0; i < positionAttribute.count; i++) {
              //   const vertex = new THREE.Vector3();
              //   vertex.fromBufferAttribute(positionAttribute, i);

              //   if (vertex.y >= 0) {
              //     vertex.applyMatrix4(rotationMatrix);
              //   }

              //   positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
              // }




              // 获取底部的中心位置
              let bottomCenter = new THREE.Vector3();
              let bottomVertexCount = 0;
              (positionAttribute.array as any[]).forEach((_, index) => {
                if (index % 3 === 0 && positionAttribute.array[index + 1] < 0) {
                  bottomCenter.x += positionAttribute.array[index];
                  bottomCenter.y += positionAttribute.array[index + 1];
                  bottomCenter.z += positionAttribute.array[index + 2];
                  bottomVertexCount++;
                }
              });
              bottomCenter.divideScalar(bottomVertexCount);

              // 创建一个旋转矩阵，绕 X 轴旋转 45° 弧度
              const rotationMatrix = new THREE.Matrix4().makeRotationX(-Math.PI / 4);

              // 修改顶点位置
              for (let i = 0; i < positionAttribute.count; i++) {
                const vertex = new THREE.Vector3();
                vertex.fromBufferAttribute(positionAttribute, i);

                if (vertex.y >= bottomCenter.y) {
                  // 将顶部部分绕 X 轴旋转
                  vertex.sub(bottomCenter);
                  vertex.applyMatrix4(rotationMatrix);
                  vertex.add(bottomCenter);
                }

                // 设置新的顶点位置
                positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
              }

              // 更新几何体的顶点位置
              positionAttribute.needsUpdate = true;
              // 更新几何体的顶点位置

              this.CloseMesh.push({ top: plane, geometry: geometry });
              group.add(plane);
            } else {
              const geometry = new THREE.PlaneGeometry(box.w, box.h);
              const material = new THREE.MeshBasicMaterial({ color: 'green', side: THREE.DoubleSide, transparent: false });
              const plane = new THREE.Mesh(geometry, material);
              plane.position.set(0, -box.z / 2, 0);
              plane.rotation.x = -Math.PI / 2;
              group.add(plane);

            }

            //plane.rotation.x = -Math.PI / 6; // 设置x轴旋转角度，使其向下倾斜


          })

          break;
        }
        case 'dust_flap': {
          // 创建梯形的顶点坐标
          //
          ['top_left', 'top_right', 'top_luck'].forEach(direction => {
            // 创建梯形形状
            const shape = new THREE.Shape();
            shape.moveTo(0, 0); // 左下角顶点
            shape.lineTo(box.h, 0);  // 右下角顶点
            shape.lineTo(box.h, box.d * 0.3); // 右上角顶点
            shape.lineTo(box.h - box.d * 0.3, box.d); // 右上角顶点
            shape.lineTo(0, box.d); // 左上角顶点
            shape.lineTo(0, 0); // 回到起点
            // 创建梯形几何体
            const extrudeSettings = {
              steps: 1,
              depth: 0.5,
              bevelEnabled: false,
            };

            if (direction == 'top_left') {
              const geometry = new THREE.ShapeGeometry(shape);
              const material = new THREE.MeshBasicMaterial({ color: 'black', side: THREE.DoubleSide, transparent: false });
              const mesh = new THREE.Mesh(geometry, material);
              mesh.rotation.x = -Math.PI / 2;
              mesh.rotation.y = -Math.PI / 2;
              mesh.rotation.z = -Math.PI / 2;

              mesh.position.set(-box.w / 2, box.z / 2, -box.h / 2);


              //mesh.rotation.set(0, 0, Math.PI / 6); // 设置平面旋转，例如倾斜 30 度

              // 假设你已经创建了一个 ShapeGeometry，命名为 shapeGeometry
              // 获取几何体的顶点属性
              const positionAttribute = geometry.getAttribute('position');

              // 创建一个旋转矩阵，绕X轴旋转 Math.PI / 8 弧度
              const rotationMatrix = new THREE.Matrix4().makeRotationX(Math.PI / 4);

              // 修改顶点位置
              for (let i = 0; i < positionAttribute.count; i++) {
                const vertex = new THREE.Vector3();
                vertex.fromBufferAttribute(positionAttribute, i);

                if (vertex.y >= 0) {
                  vertex.applyMatrix4(rotationMatrix);
                }

                positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
              }

              // 更新几何体的顶点位置
              positionAttribute.needsUpdate = true;
              // mesh.matrix.setPosition(-box.w/2,box.h/2,0)
              // mesh.updateMatrixWorld(); // 更新对象的世界矩阵

              this.CloseMesh.push({ left: mesh, geometry: geometry });
              group.add(mesh);
            } else if (direction == 'top_right') {

              const geometry = new THREE.ShapeGeometry(shape);
              const material = new THREE.MeshBasicMaterial({ color: 'black', side: THREE.DoubleSide, transparent: false });
              const mesh = new THREE.Mesh(geometry, material);
              mesh.rotation.x = -Math.PI / 2;
              mesh.rotation.y = -Math.PI / 2;
              mesh.rotation.z = -Math.PI / 2;


              mesh.position.set(box.w / 2, box.z / 2, -box.h / 2);

              // 获取几何体的顶点属性
              const positionAttribute = geometry.getAttribute('position');

              // 创建一个旋转矩阵，绕X轴旋转 -Math.PI / 8 弧度
              const rotationMatrix = new THREE.Matrix4().makeRotationX(-Math.PI / 4);

              // 修改顶点位置
              for (let i = 0; i < positionAttribute.count; i++) {
                const vertex = new THREE.Vector3();
                vertex.fromBufferAttribute(positionAttribute, i);

                if (vertex.y >= 0) {
                  vertex.applyMatrix4(rotationMatrix);
                }

                positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
              }

              // 更新几何体的顶点位置
              positionAttribute.needsUpdate = true;


              // mesh.matrix.setPosition(-box.w/2,box.h/2,0)
              // mesh.updateMatrixWorld(); // 更新对象的世界矩阵
              this.CloseMesh.push({ right: mesh, geometry: geometry });
              group.add(mesh);
            } else {
              //top_luck
              // 创建梯形形状
              const shape = new THREE.Shape();
              shape.moveTo(0, 0); // 左下角顶点
              shape.lineTo(box.w, 0);  // 右下角顶点
              shape.lineTo(box.w, box.luck * 0.5); // 右上角顶点
              shape.lineTo(box.w - box.luck * 0.5, box.luck); // 左上角顶点
              shape.lineTo(box.luck * 0.5, box.luck);
              shape.lineTo(0, box.luck * 0.5);
              shape.lineTo(0, 0); // 回到起点
              // 创建梯形几何体
              const extrudeSettings = {
                steps: 1,
                depth: 0.5,
                bevelEnabled: false,
              };
              const geometry = new THREE.ShapeGeometry(shape);
              const material = new THREE.MeshBasicMaterial({ color: 'black', side: THREE.DoubleSide, transparent: false });
              const mesh = new THREE.Mesh(geometry, material);


              // const initialPosition = new THREE.Vector3(-box.w / 2, box.z / 2 + box.h, -box.h / 2);
              // const initialRotation = new THREE.Euler(0, 0, 0, 'XYZ');
              // const initialScale = new THREE.Vector3(1, 1, 1);

              // mesh.position.copy(initialPosition);
              // mesh.rotation.copy(initialRotation);
              // mesh.scale.copy(initialScale);

              // 进行位置变换
              mesh.position.set(-box.w / 2, box.z / 2 + Math.cos(Math.PI / 4) * box.h, -Math.cos(Math.PI / 4) * box.h - box.h / 2);



              // mesh.matrix.setPosition(-box.w/2,box.h/2,0)


              this.CloseMesh.push({ top_luck: mesh });
              group.add(mesh);

            }
            //const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

          });
          ['bottom_top_luck_left', 'bottom_top_luck_right'].forEach(direction => {
            const shape = new THREE.Shape();



            // shape.moveTo(0, 0); // 左下角顶点
            // shape.lineTo(box.h, 0);  // 右下角顶点
            // shape.lineTo(box.h, box.d * 0.3); // 右上角顶点
            // shape.lineTo(0, box.d); // 左上角顶点
            // shape.lineTo(0, 0); // 回到起点


            //shape.moveTo(0, 0); // 左下角顶点
            shape.lineTo(0, box.h / 2);  // 右下角顶点
            shape.lineTo(box.d, box.h / 2);  // 右下角顶点
            shape.lineTo(box.d, -(box.h - box.d * 0.3) / 2); // 右上角顶点
            shape.lineTo(box.d * 0.3, -box.h / 2); // 右上角顶点

            shape.lineTo(0, -box.h / 2); // 左上角顶点
            //shape.lineTo( box.d * 0.3, -box.h / 2); // 左上角顶点

            shape.lineTo(0, box.h / 2);  // 右下角顶点

            if (direction == 'bottom_top_luck_left') {
              // 创建梯形形状

              // 创建梯形几何体
              const extrudeSettings = {
                steps: 1,
                depth: 0.5,
                bevelEnabled: false,
              };
              const geometry = new THREE.ShapeGeometry(shape);
              const material = new THREE.MeshBasicMaterial({ color: 'black', side: THREE.DoubleSide, transparent: false });
              const mesh = new THREE.Mesh(geometry, material);

              mesh.rotation.x = -Math.PI / 2;
              mesh.position.set(-box.w / 2, -box.z / 2, 0);


              // mesh.matrix.setPosition(-box.w/2,box.h/2,0)
              // mesh.updateMatrixWorld(); // 更新对象的世界矩阵
              group.add(mesh);
            } else if (direction == 'bottom_top_luck_right') {
              // 创建梯形形状
              const geometry = new THREE.ShapeGeometry(shape);
              const material = new THREE.MeshBasicMaterial({ color: 'black', side: THREE.DoubleSide, transparent: false });
              const mesh = new THREE.Mesh(geometry, material);
              mesh.rotation.x = Math.PI / 2;
              mesh.rotation.z = -Math.PI;

              // mesh.rotation.y = Math.PI / 2;
              // mesh.rotation.z = Math.PI / 1;
              //mesh.position.set(box.w / 2, box.z / 2, -box.h / 2);
              // mesh.matrix.setPosition(-box.w/2,box.h/2,0)
              mesh.position.set(box.w / 2, -box.z / 2, 0);
              //mesh.updateMatrixWorld(); // 更新对象的世界矩阵
              group.add(mesh);
            }
          });

          break;
        }
        default: {
          break;
        }
      }

    })



    // // 创建一个纹理
    // const texture = new THREE.TextureLoader().load('texture.jpg');

    // // 创建一个 BoxGeometry
    // const geometry = new THREE.BoxGeometry(1, 1, 1);

    // // 设置 UV 坐标，控制纹理的放置
    // geometry.faceVertexUvs[0] = [
    //     [
    //         new THREE.Vector2(0, 0),
    //         new THREE.Vector2(1, 0),
    //         new THREE.Vector2(1, 1)
    //     ],
    //     [
    //         new THREE.Vector2(0, 0),
    //         new THREE.Vector2(1, 1),
    //         new THREE.Vector2(0, 1)
    //     ],
    //     // ... 设置其他面的 UV 坐标
    // ];


    // 创建纹理并应用到整个 Group
    const texture1 = new THREE.TextureLoader().load('assets/images/22.webp');
    // texture1.wrapS = THREE.RepeatWrapping;
    // texture1.wrapT = THREE.RepeatWrapping;
    // texture1.repeat.set(1, 1); // 调整纹理的重复次数
    const materialGroup = new THREE.MeshBasicMaterial({ map: texture1, side: THREE.DoubleSide, transparent: false });

    // group.traverse(child => {
    //   if (child instanceof THREE.Mesh) {
    //     const material = new THREE.MeshBasicMaterial({ map: texture1, side: THREE.DoubleSide, transparent: false });
    //     child.material = material;
    //     // 设置 UV 坐标，控制纹理的放置
    //     //    if (!child.geometry.attributes.uv) {
    //     //     child.geometry.setAttribute('uv', new THREE.Float32BufferAttribute([], 2));
    //     //   }
    //     //    child.geometry.faceVertexUvs[0] = [
    //     //     [
    //     //         new THREE.Vector2(0, 0),
    //     //         new THREE.Vector2(1, 0),
    //     //         new THREE.Vector2(1, 1)
    //     //     ],
    //     //     [
    //     //         new THREE.Vector2(0, 0),
    //     //         new THREE.Vector2(1, 1),
    //     //         new THREE.Vector2(0, 1)
    //     //     ],
    //     //     // ... 设置其他面的 UV 坐标
    //     // ];
    //   }
    // });



    this.scene.add(group)




    // 射线拾取函数
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // 鼠标移动事件处理



    // 鼠标移动事件处理
    window.addEventListener('mousemove', (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // 鼠标点击事件处理
    window.addEventListener('mousemove', () => {
      raycaster.setFromCamera(mouse, this.camera);
      const intersects = raycaster.intersectObjects(this.scene.children, true);

      if (intersects.length > 0) {
        // 找到第一个选中的 Mesh 对象
        const selectedMesh: any = intersects.find(obj => obj.object as any)?.object;

        if (intersects.length > 0) {
          // 找到第一个选中的 Mesh 对象
          const selectedMesh = intersects.find(obj => obj.object as any)?.object;

          if (selectedMesh) {
            //console.log(selectedMesh);
            //(selectedMesh as any).material.color.set('yellow');
            // 如果已选中对象且鼠标不在它上面，恢复原始颜色
            // if (selectedMesh && !intersects.some(obj => obj.object === selectedMesh)) {
            //   selectedMesh.material.color.set(selectedMesh.userData.originalColor);
            //   selectedMesh = null;
            // }

            // 检查鼠标是否悬停在某个对象上
            // if (intersects.length > 0) {
            //     const hoveredMesh = intersects.find(obj => obj.object instanceof THREE.Mesh)?.object;

            //     if (hoveredMesh instanceof THREE.Mesh) {
            //         // 保存当前颜色，以便在取消悬停时还原
            //         hoveredMesh.userData.originalColor = hoveredMesh.material.color.getHex();

            //         // 设置悬停颜色
            //         hoveredMesh.material.color.set('yellow');

            //         // 将悬停的对象赋值给 selectedMesh
            //         selectedMesh = hoveredMesh;
            //     }
            // }
          }
        }
      }
    });















    this.renderer.setClearColor('#000');
    this.scene.background = new THREE.Color('#999')
    // scene.add(capsule);


    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.camera.position.set(0, 0, 25);

    this.camera.fov = 60; // 调整视野
    this.camera.updateProjectionMatrix(); // 更新投影矩阵
    // 将相机最小缩放距离设置为1
    // controls.minZoom = 1;
    controls.update();

    const animate = () => {
      requestAnimationFrame(animate);
      // required if controls.enableDamping or controls.autoRotate are set to true
      controls.update();
      this.renderer.render(this.scene, this.camera);
    }
    animate()
  }


  close(state: string) {


    // 创建动画数组
    // 初始的 Matrix4，表示展开状态
    const initialMatrix = new THREE.Matrix4();
    // 目标的 Matrix4，表示关闭状态
    const targetMatrix = new THREE.Matrix4();
    // 设置目标 Matrix4 的值，根据需要调整

    console.log(this.CloseMesh);
    let mesh;
    this.CloseMesh.forEach((value, index: number) => {

      switch (Object.keys(value)[0]) {
        case 'left': {
          // 设置动画的目标旋转角度
          const rotationMatrix = new THREE.Matrix4().makeRotationX(state == 'open' ? Math.PI / 4 : -Math.PI / 4); // 旋转矩阵，绕X轴旋转 Math.PI / 4 弧度

          const initialPositionAttribute = value.geometry.getAttribute('position').clone();
          const targetPositionAttribute = value.geometry.getAttribute('position').clone();

          for (let i = 0; i < targetPositionAttribute.count; i++) {
            const vertex = new THREE.Vector3();
            vertex.fromBufferAttribute(targetPositionAttribute, i);

            if (vertex.y >= 0) {
              vertex.applyMatrix4(rotationMatrix);
            }

            targetPositionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
          }

          const duration = 3000; // 动画持续时间
          const tween = new TWEEN.Tween({ t: 0 })
            .to({ t: 1 }, duration)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(({ t }) => {
              const positionAttribute = value.geometry.getAttribute('position');

              for (let i = 0; i < positionAttribute.count; i++) {
                const initialVertex = new THREE.Vector3().fromBufferAttribute(initialPositionAttribute, i);
                const targetVertex = new THREE.Vector3().fromBufferAttribute(targetPositionAttribute, i);

                const lerpedVertex = initialVertex.lerp(targetVertex, t);
                positionAttribute.setXYZ(i, lerpedVertex.x, lerpedVertex.y, lerpedVertex.z);
              }
              positionAttribute.needsUpdate = true;

              this.renderer.render(this.scene, this.camera);
            })
            .start();

          // 渲染函数
          const animate = (time) => {
            TWEEN.update(); // 更新动画状态

            requestAnimationFrame(animate);
            this.renderer.render(this.scene, this.camera);
          };

          // 初始化动画
          requestAnimationFrame(animate);
          break;
        }


        case 'right': {
          // 设置动画的目标旋转角度
          const rotationMatrix = new THREE.Matrix4().makeRotationX(state == 'open' ? -Math.PI / 4 : Math.PI / 4); // 旋转矩阵，绕X轴旋转 Math.PI / 4 弧度

          const initialPositionAttribute = value.geometry.getAttribute('position').clone();
          const targetPositionAttribute = value.geometry.getAttribute('position').clone();

          for (let i = 0; i < targetPositionAttribute.count; i++) {
            const vertex = new THREE.Vector3();
            vertex.fromBufferAttribute(targetPositionAttribute, i);

            if (vertex.y >= 0) {
              vertex.applyMatrix4(rotationMatrix);
            }

            targetPositionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
          }

          const duration = 3000; // 动画持续时间
          const tween = new TWEEN.Tween({ t: 0 })
            .to({ t: 1 }, duration)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(({ t }) => {
              const positionAttribute = value.geometry.getAttribute('position');

              for (let i = 0; i < positionAttribute.count; i++) {
                const initialVertex = new THREE.Vector3().fromBufferAttribute(initialPositionAttribute, i);
                const targetVertex = new THREE.Vector3().fromBufferAttribute(targetPositionAttribute, i);

                const lerpedVertex = initialVertex.lerp(targetVertex, t);
                positionAttribute.setXYZ(i, lerpedVertex.x, lerpedVertex.y, lerpedVertex.z);
              }
              positionAttribute.needsUpdate = true;

              this.renderer.render(this.scene, this.camera);
            })
            .start();

          // 渲染函数
          const animate = (time) => {
            TWEEN.update(); // 更新动画状态

            requestAnimationFrame(animate);
            this.renderer.render(this.scene, this.camera);
          };

          // 初始化动画
          requestAnimationFrame(animate);


        }

          break;
        case 'top': {

          // 设置动画的目标旋转角度
          const rotationMatrix = new THREE.Matrix4().makeRotationX(-Math.PI / 2); // 旋转矩阵，绕X轴旋转 Math.PI / 4 弧度

          const initialPositionAttribute = value.geometry.getAttribute('position').clone();
          const targetPositionAttribute = value.geometry.getAttribute('position').clone();



          // 获取底部的中心位置
          let bottomCenter = new THREE.Vector3();
          let bottomVertexCount = 0;
          (initialPositionAttribute.array as any[]).forEach((_, index) => {
            if (index % 3 === 0 && initialPositionAttribute.array[index + 1] < 0) {
              bottomCenter.x += initialPositionAttribute.array[index];
              bottomCenter.y += initialPositionAttribute.array[index + 1];
              bottomCenter.z += initialPositionAttribute.array[index + 2];
              bottomVertexCount++;
            }
          });
          bottomCenter.divideScalar(bottomVertexCount);



          // 修改顶点位置
          for (let i = 0; i < initialPositionAttribute.count; i++) {
            const vertex = new THREE.Vector3();
            vertex.fromBufferAttribute(initialPositionAttribute, i);
            if (vertex.y >= 0) {
              vertex.applyMatrix4(rotationMatrix);
            }
            // if (vertex.y >= bottomCenter.y) {
            //   // 将顶部部分绕 X 轴旋转
            //   vertex.sub(bottomCenter);
            //   vertex.applyMatrix4(rotationMatrix);
            //   vertex.add(bottomCenter);
            // }

            // 设置新的顶点位置
            initialPositionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
          }
          const duration = 3000; // 动画持续时间
          const tween = new TWEEN.Tween({ t: 0 })
            .to({ t: 1 }, duration)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(({ t }) => {
              const positionAttribute = value.geometry.getAttribute('position');

              for (let i = 0; i < positionAttribute.count; i++) {
                const initialVertex = new THREE.Vector3().fromBufferAttribute(initialPositionAttribute, i);
                const targetVertex = new THREE.Vector3().fromBufferAttribute(targetPositionAttribute, i);

                const lerpedVertex = initialVertex.lerp(targetVertex, t);
                positionAttribute.setXYZ(i, lerpedVertex.x, lerpedVertex.y, lerpedVertex.z);
              }
              positionAttribute.needsUpdate = true;

              this.renderer.render(this.scene, this.camera);
            })
            .start();

          // 渲染函数
          const animate = (time) => {
            TWEEN.update(); // 更新动画状态
            requestAnimationFrame(animate);
            this.renderer.render(this.scene, this.camera);

          };

          // 初始化动画

          requestAnimationFrame(animate);
          break;
        }

        // case 'top_luck':
        //   targetRotation = new THREE.Euler(-Math.PI / 4, 0, 0);
        //   mesh = value.top_luck;
        //   break;
        // default:
        //   targetRotation = new THREE.Euler(-Math.PI / 4, 0, 0);
        //   mesh = value.top;
        //   break;
      }
      // 创建 TWEEN 动画
      // const animationDuration = 1000; // 动画持续时间，单位毫秒
      // //console.log(Object.values(this.CloseMesh)[index],index);
      // console.log(mesh);
      // const rotationTween = new TWEEN.Tween(mesh.rotation)
      //   .to(targetRotation, animationDuration)
      //   .easing(TWEEN.Easing.Linear.None) // 设置缓动函数
      //   .onUpdate(() => {
      //   }).start();

      // animations.push(rotationTween); // 将 tween 添加到数组
      // console.log(animations);
    })

    // 更新动画
    // const animate = () => {
    //   requestAnimationFrame(animate);
    //   TWEEN.update(); // 更新动画状态
    //   this.renderer.render(this.scene, this.camera);
    //   // 渲染场景...

    //   //requestAnimationFrame(animate)
    // }
    //animate();
    // requestAnimationFrame(animate)
    // 启动所有动画
    // for (const tween of animations) {
    //   tween.start();
    //   tween.update()
    // }
  }



}
