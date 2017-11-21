<template>
  <div class="flag" :class="{
    hidden: !visible
  }"></div>
</template>

<style>
.flag {
  position: absolute;
  background-image: url('../assets/star.png');
  left: 50%;
  top: 50%;
  width: 50px;
  height: 50px;
  transform: translate(-50%, -50%);
  z-index: 102;
  transition-property: left, top;
  transition: linear;
  transition-duration: 400ms;
  background-color: transparent;
  background-size: contain;
  background-position: center center;
  opacity: 1;
}

.flag.hidden {
  opacity: 0;
}
</style>

<script>
export default {
  name: 'Flag',

  props: {
    position: Object
  },

  computed: {
    visible () {
      return !!this.position
    }
  }
}
</script>
