import React, { useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import Physijs from "./vendors/physi.js";
import "./App.css";

function App() {
  useEffect(() => {
    // === THREE.JS CODE START ===
    var scene = new THREE.Scene();

    var loader = new GLTFLoader();

    const backgroundColor = 0xf1f1f1;
    scene.background = new THREE.Color(backgroundColor);
    scene.fog = new THREE.Fog(backgroundColor, 60, 100);
    var camera = new THREE.PerspectiveCamera( 50, window.innerWidth/window.innerHeight, 0.1, 1000 );
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);

    document.body.appendChild( renderer.domElement );
    
    camera.position.set( 10, 30, 1 ); // OrbitControls target is the origin
    function update() {
      renderer.render(scene, camera);
      requestAnimationFrame(update);
    }
    update();
    // controls
    var controls = new OrbitControls( camera, renderer.domElement );
    controls.addEventListener( 'change', update ); // use this only if there is no animation loop
    controls.enableZoom = false;
    controls.enablePan = false;
    // Add lights
    let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
    hemiLight.position.set(0, 50, 0);
    // Add hemisphere light to scene
    scene.add(hemiLight);

    let d = 8.25;
    let dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
    dirLight.position.set(-8, 12, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 1500;
    dirLight.shadow.camera.left = d * -1;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = d * -1;
    // Add directional Light to scene
    scene.add(dirLight);
    // Floor
    let floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
    let floorMaterial = new THREE.MeshPhongMaterial({
      color: 0xeeeeee,
      shininess: 0,
    });

    let floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -0.5 * Math.PI; // This is 90 degrees by the way
    floor.receiveShadow = true;
    floor.position.y = -13;
    scene.add(floor);


    var shrimp = null;

    loader.load( 'https://res.cloudinary.com/ditoqsj8e/image/upload/v1603297141/10048_Shrimp_v1_hcyehn.glb', ( gltf ) => {
      var blocks = []
      var createTower = (function() {
        var  block_height = 1, block_offset = 2;
        
        return function() {
          var i, j, rows = 16,
            block;
  
          for ( i = 0; i < rows; i++ ) {
            for ( j = 0; j < 3; j++ ) {
              var copied = Object.assign({}, gltf);
              shrimp = copied.scene;

              var block = shrimp.clone();
              block.position.y = ((block_height / 2) + block_height * i) - 10;
              block.scale.x = 0.4;
              block.scale.y = 0.3;
              block.scale.z = 0.2;
              block.rotation.z = Math.PI / 2.01; // #TODO: There's a bug somewhere when this is to close to 2
              if ( i % 2 === 0 ) {
                block.rotation.y = Math.PI / 2.01; // #TODO: There's a bug somewhere when this is to close to 2
                block.position.x = block_offset * j - ( block_offset * 3 / 2 - block_offset / 2 ) - 2;
              } else {
                block.position.z = block_offset * j - ( block_offset * 3 / 2 - block_offset / 2 ) - 2;
              }
              block.receiveShadow = true;
              block.castShadow = true;
              scene.add( block );
              blocks.push( block );
            }
          }
        }
      })();
  
      createTower();
    }, undefined, function ( error ) {

      console.error( error );

    } );


    // scene.add( cube );
    var animate = function () {
      requestAnimationFrame( animate );
      renderer.render( scene, camera );
    };
    animate();
    // === THREE.JS EXAMPLE CODE END ===
  }, [])

  return (
    <div
      id="viewport"
      className="App"
      style={{ backgroundColor: "white" }}
    ></div>
  );
}

export default App;
