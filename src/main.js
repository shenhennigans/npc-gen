import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import { OhVueIcon, addIcons } from "oh-vue-icons";
import * as gameIcons from "oh-vue-icons/icons/gi";



const Gi = Object.values({ ...gameIcons });
addIcons(...Gi);

const app = createApp(App);
app.component("v-icon", OhVueIcon);
app.mount("#app");

