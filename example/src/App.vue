<template>
  <div id="App">
    <p class="title">
      Hello
      <b>{{ msg }}!</b>
    </p>
  </div>
</template>

<script>
export default {
  name: 'App',

  data() {
    return {
      msg: 'World',
    };
  },
};
</script>

<style lang="scss">
@import './style.scss';
.title {
  font-weight: 600;
  color: red;
}
</style>
