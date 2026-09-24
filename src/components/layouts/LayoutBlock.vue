<template>
  <div class="block">
    <slot />
    <div class="corners">
      <span class="top left"></span>
      <span class="top right"></span>
      <span class="bottom left"></span>
      <span class="bottom right"></span>
    </div>
  </div>
</template>

<style scoped>
.block {
  position: relative;
  background-color: #0000000a;
}

.corners {
  position: absolute;
  pointer-events: none;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;

  span {
    position: absolute;
    display: block;
    width: 1ch;
    height: 1ch;
    background-color: #eee;
  }

  .top {
    top: 0;
  }
  .bottom {
    bottom: 0;
  }
  .right {
    right: 0;
  }
  .left {
    left: 0;
  }
}
</style>
