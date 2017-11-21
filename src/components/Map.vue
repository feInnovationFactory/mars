<template>
  <div class="tank-map" :style="{
    width: size * 50 + 'px'
  }">
    <div class="tank-map-row" v-for="(row, index) in data" :key="index">
      <span class="tank-map-cell" :class="{
        'is-empty': cell.type === 0,
        'is-block': cell.type === 1,
        'is-forest': cell.type === 2
      }" v-for="(cell, index) in row" :key="index">
      </span>
    </div>
    <slot></slot>
  </div>
</template>

<style>
.tank-map {
  position: relative;
  display: table;
  background-image: url('../assets/ground.png');
  background-repeat: repeat-x repeat-y;
}

.tank-map-row {
  display: table-row;
}

.tank-map-cell {
  display: table-cell;
  width: 50px;
  height: 50px;
  background-color: transparent;
  background-size: contain;
  background-position: center center;
}

.tank-map-cell.is-block {
  background-image: url('../assets/stone.png')
}

.tank-map-cell.is-forest {
  background-image: url('../assets/grass.png')
}
</style>

<script>
export default {
  name: 'Map',

  props: {
    data: {
      type: Array
    },
    size: {
      type: Number
    }
  }
}
</script>
