<template>
  <div id="App">
    <p class="title">
      Hello
      <b class="name">{{ msg }}!</b>
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
  color: rgb(79, 92, 97);
  font-size: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;
}

.name {
  font-weight: 600;
}
</style>
