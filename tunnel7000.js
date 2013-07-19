var WIDTH=640;
var HEIGHT=480;

var scene;
var camera;
var renderer;
var uniforms;
var mesh;
var material;

/**
 * 
 */
function initScene() {
    scene = new THREE.Scene(); 
    //var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);  
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100.0);
    camera.position.z = 5;  
    scene.add(camera);
    renderer = new THREE.WebGLRenderer(); 
    renderer.setSize(WIDTH, HEIGHT); 
    document.getElementById("glcontainer").appendChild(renderer.domElement);  
    
    uniforms = {
	time: { type:"f", value:0 },
	resolution: { type:"v2", value:new THREE.Vector2(WIDTH,HEIGHT) },
	tex0: { type:"t", value: THREE.ImageUtils.loadTexture("polka_dot.jpg") },
//	perlin_p: { type:"iv1", value: perlin_p },
//	perlin_g2: { type:"fv1", value: perlin_g2 },
	mouse: { type:"v2", value:new THREE.Vector2(0,0) },
	mouseLeft: { type:"i", value:0 },	

	tunnelCenter : { type:"v2", value: new THREE.Vector2(0.0, 0.0) },

    };
    uniforms.tex0.value.wrapS = THREE.RepeatWrapping;
    uniforms.tex0.value.wrapT = THREE.RepeatWrapping;

    mesh = null;

    //document.getElementById("glcontainer").addEventListener("keypress", reloadCurrentShader());
}

function updateTunnelCenter() {
    uniforms.tunnelCenter.value = new THREE.Vector2(document.getElementById("tunnelCx").value, 
						    document.getElementById("tunnelCy").value);
}

function addMesh() {

    if (mesh != null) 
	scene.remove(mesh);

    material = new THREE.ShaderMaterial({
	uniforms: uniforms,
	vertexShader: getShader('vertexShader'),
	fragmentShader: getShader('fragmentShader'),
    });
    
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(-1, -1, 0));
    geometry.vertices.push(new THREE.Vector3(1, -1, 0));
    geometry.vertices.push(new THREE.Vector3(1, 1, 0));
    geometry.vertices.push(new THREE.Vector3(-1, 1, 0));
    geometry.faces.push(new THREE.Face4(0,1,2,3));
    
    var s = WIDTH/256.0;
    var t = HEIGHT/256.0;
    
    // Three.js does not support flipping y coordinate of a loaded textures
    // so we do it manually
    geometry.faceVertexUvs[0].push([
	new THREE.Vector2(0,t),
	new THREE.Vector2(s,t),
	new THREE.Vector2(s,0),
	new THREE.Vector2(0,0)
    ]);
    
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
}

var shaders = new Array();
var numShaders = 0;
var numShadersLoaded = 0;
var preloadInterval;

function init() {
    preloadInterval = setInterval('preloadCheck()', 100);
}

function preloadCheck() {
    if (numShadersLoaded == numShaders) {
	clearInterval(preloadInterval);
	initScene();
	addMesh();
	render(); 
    }
}

/**
 * 
 */

function getShader(id) {
    return document.getElementById(id).text;
}

function getTimer() {    
    if (window.performance) {
	if (window.performance.now)
	    return window.performance.now();
	else
	    return window.performance.webkitNow();
    }
    else {
	return new Date().getTime();
    }
}

function render() { 
    requestAnimationFrame(render);  
    renderer.render(scene, camera); 
    uniforms.time.value = getTimer() / 1000.0;
} 


