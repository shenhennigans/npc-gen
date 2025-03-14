// bootstrap css files
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
// project css files
import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
// importing icons
import { OhVueIcon, addIcons } from "oh-vue-icons";
import * as gameIcons from "oh-vue-icons/icons/gi";
// loading icons
const Gi = Object.values({ ...gameIcons });
addIcons(...Gi);

const app = createApp(App);
// adding icons to app
app.component("v-icon", OhVueIcon);
// mounting app
app.mount("#app");