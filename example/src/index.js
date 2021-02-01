// import './style.scss';
import { cloneDeep } from './cloneDeep';
import Vue from 'vue';
import App from '@/App.vue';

new Vue({
  el: '#root',
  render: h => h(App),
});

const obj = {
  name: 'Tom',
  age: 18,
  [Symbol('fn')]: Array.isArray,
};

const cloneData = cloneDeep(obj);

console.log(cloneData);
console.log(process.env);

// document.body.innerHTML = JSON.stringify(cloneData, '', { spaces: 2 });
