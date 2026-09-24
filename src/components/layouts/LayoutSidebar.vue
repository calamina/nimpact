<template>
  <section>
    <slot />
  </section>
</template>

<style scoped>
section {
  height: 100svh;
  width: 100%;
  overflow-y: auto;
  display: flex;
  flex-flow: column;
  background-color: #ffffff55;
  scrollbar-color: #00000020 transparent;
}
</style>
