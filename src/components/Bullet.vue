<template>
  <div class="bullet" :class="{
    'is-blue': type === 'blue',
    'is-red': type === 'red',
    'is-down': dir === 'down',
    'is-left': dir === 'left',
    'is-right': dir === 'right',
    'is-destroyed': status === 'destroyed'
  }"
  :style="{
    left: (position ? position.y * 50 : 0) + 'px',
    top: (position ? position.x * 50 : 0) + 'px',
    'transition-duration': speed ? speed * 0.8 + 'ms' : '500ms'
  }">
  </div>
</template>

<style>
.bullet {
  position: absolute;
  width: 50px;
  height: 50px;
  background-color: transparent;
  background-size: contain;
  background-position: center top;
  z-index: 101;
  transition-property: left, top;
  transition: linear;
  transition-duration: 400ms;
}

.bullet.is-destroyed {
  display: none;
}

.bullet.is-red {
  background-image: url('../assets/bullet1.png');
}

.bullet.is-blue {
  background-image: url('../assets/bullet2.png');
}

.bullet.is-down {
  transform: rotateZ(180deg)
}

.bullet.is-right {
  transform: rotateZ(90deg)
}

.bullet.is-left {
  transform: rotateZ(-90deg)
}
</style>

<script>
export default {
  name: 'Bullet',

  props: {
    type: String,
    position: Object,
    dir: String,
    status: String,
    speed: Number
  }
}
</script>
