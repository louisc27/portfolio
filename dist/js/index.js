let scene, camera, renderer, stars, starGeo;

function init() {

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(60,window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 1;
  camera.rotation.x = Math.PI/2;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  starGeo = new THREE.Geometry();
  for(let i=0;i<6000;i++) {
    star = new THREE.Vector3(
      Math.random() * 600 - 300,
      Math.random() * 600 - 300,
      Math.random() * 600 - 300
    );
    star.velocity = 0;
    star.acceleration = 0.02;
    starGeo.vertices.push(star);
  }

  let sprite = new THREE.TextureLoader().load( '../dist/img/star.png' );
  let starMaterial = new THREE.PointsMaterial({
    color: 0xaaaaaa,
    size: 0.7,
    map: sprite
  });

  stars = new THREE.Points(starGeo,starMaterial);
  scene.add(stars);

  window.addEventListener("resize", onWindowResize, false);

  animate(); 
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
function animate() {
  starGeo.vertices.forEach(p => {
    p.velocity += p.acceleration
    p.y -= p.velocity;
    
    if (p.y < -200) {
      p.y = 200;
      p.velocity = 0;
    }
  });
  starGeo.verticesNeedUpdate = true;
  stars.rotation.y +=0.002;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
init();

function toggle(){
  let sec = document.getElementById('sec');
  let thi = document.getElementById('navigation');
  sec.classList.toggle('active');
  thi.classList.toggle('active');
}





Vue.config.devtools = true;

Vue.component('profile', {
  template: `
    <div class="profile-wrap"
      @mousemove="handleMouseMove"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      ref="profile">
      <div class="profile"
        :style="profileStyle">
        <div class="profile-bg" :style="[profileBgTransform, profileBgImage]"></div>
        <div class="profile-info">
          <slot name="header"></slot>
          <slot name="content"></slot>
        </div>
      </div>
    </div>`,
  mounted() {
    this.width = this.$refs.profile.offsetWidth;
    this.height = this.$refs.profile.offsetHeight;
  },
  props: ['dataImage'],
  data: () => ({
    width: 0,
    height: 0,
    mouseX: 0,
    mouseY: 0,
    mouseLeaveDelay: null
  }),
  computed: {
    mousePX() {
      return this.mouseX / this.width;
    },
    mousePY() {
      return this.mouseY / this.height;
    },
    profileStyle() {
      const rX = this.mousePX * 30;
      const rY = this.mousePY * -30;
      return {
        transform: `rotateY(${rX}deg) rotateX(${rY}deg)`
      };
    },
    profileBgTransform() {
      const tX = this.mousePX * -40;
      const tY = this.mousePY * -40;
      return {
        transform: `translateX(${tX}px) translateY(${tY}px)`
      }
    },
    profileBgImage() {
      return {
        backgroundImage: `url(${this.dataImage})`
      }
    }
  },
  methods: {
    handleMouseMove(e) {
      this.mouseX = e.pageX - this.$refs.profile.offsetLeft - this.width/2;
      this.mouseY = e.pageY - this.$refs.profile.offsetTop - this.height/2;
    },
    handleMouseEnter() {
      clearTimeout(this.mouseLeaveDelay);
    },
    handleMouseLeave() {
      this.mouseLeaveDelay = setTimeout(()=>{
        this.mouseX = 0;
        this.mouseY = 0;
      }, 1000);
    }
  }
});

const app = new Vue({
  el: '#app'
});



