import * as THREE from 'three';

export class World{
   #engine
   #scene = new THREE.Scene();
   #camera
   #objectMap = new Map();
   #fov = 75;
   #aspect = 2;
   #zFar = 1000;
   #zNear = 0.1;

   constructor(engine){
      this.#engine = engine;
   }

   initialize(){
      this.#engine.initialize();
      this.#createDefaultCamera();
      this.#setUpScene();
   }

   update(elapsedMS){
      const elapsedSeconds = elapsedMS / 1000;
      this.#engine.update(elapsedMS);
      const box1 = this.#objectMap.get('Box1');
      const deltaRadians = THREE.MathUtils.degToRad(90 * elapsedSeconds);
      box1.rotateY(deltaRadians);
   }

   preRender(){
   }

   render(){
      this.#engine.render(this.#scene, this.#camera);
   }

   #setUpScene(){
      const whiteColor = new THREE.Color('white');
      const intensity = 0.6;
      const light = new THREE.DirectionalLight(whiteColor, intensity);
      light.castShadow = true;
      light.position.set(10, 10, -4);
      this.#scene.add(light);

      const softWhite = new THREE.Color(0x404040);
      const softLight = new THREE.AmbientLight(softWhite); 
      this.#scene.add(softLight);

      this.#camera.lookAt(0, 0, 0);
      this.#camera.position.set(2, 2, 5); 
      this.#camera.updateProjectionMatrix();

      // See: https://en.wikipedia.org/wiki/X11_color_names
      let floorColor = new THREE.Color('lightslategray');
      let geometry = new THREE.PlaneGeometry(10,10);
      let material = new THREE.MeshPhongMaterial( {color: floorColor, side: THREE.DoubleSide} );
      const floor = new THREE.Mesh( geometry, material );
      floor.rotateX(THREE.MathUtils.degToRad(90));
      floor.receiveShadow = true;
      this.#scene.add(floor);

      let color = new THREE.Color('forestgreen');
      let width = 0.5;
      let height = 1;
      let depth = 0.5;
      geometry = new THREE.BoxGeometry(width, height, depth);
      material = new THREE.MeshPhongMaterial({color});
      const box1 = new THREE.Mesh(geometry, material);
      box1.position.set(0, 0.5, 0);
      box1.castShadow = true;
      box1.receiveShadow = true;
      this.#scene.add(box1);
      this.#objectMap.set('Box1', box1);
   }

   #createDefaultCamera(){
      this.#camera = new THREE.PerspectiveCamera(
         this.#fov, this.#aspect, this.#zNear, this.#zFar);
      this.#camera.lookAt(0, 0, 0);
      this.#camera.position.set(0, 1, 5); 
      this.#camera.updateProjectionMatrix();
   }

}