<template>
  <div class="tank" :class="{
    'is-blue': type === 'blue',
    'is-red': type === 'red',
    'is-down': dir === 'down',
    'is-left': dir === 'left',
    'is-right': dir === 'right'
  }"
  :style="{
    left: (position ? position.y * 50 : 0) + 'px',
    top: (position ? position.x * 50 : 0) + 'px',
    'transition-duration': speed ? speed * 0.8 + 'ms' : '500ms'
  }"><span class="tank-id">{{id}}</span></div>
</template>

<style>
.tank {
  position: absolute;
  width: 50px;
  height: 50px;
  background-color: transparent;
  background-size: contain;
  background-position: center center;
  z-index: 100;
  transition-property: left, top;
  transition: linear;
  transition-duration: 400ms;
}

.tank-id {
  position: absolute;
  color: white;
  text-align: center;
  left: 50%;
  bottom: 1px;
  font-size: 12px;
  transform: translate(-50%, 0);
}

.tank.is-red {
  background-image: url('../assets/tank1.png');
}

.tank.is-blue {
  background-image: url('../assets/tank2.png');
}

.tank.is-down {
  transform: rotateZ(180deg)
}

.tank.is-right {
  transform: rotateZ(90deg)
}

.tank.is-left {
  transform: rotateZ(-90deg)
}
</style>

<script>
  export default {
    name: 'tank',

    props: {
      id: [String, Number],
      type: String,
      dir: String,
      status: String,
      position: Object,
      speed: Number
    }
  }
</script>
