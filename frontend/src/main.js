import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Deck from './Deck.vue'
import Login from './Login.vue'
import Board from './Board.vue'

Vue.use(VueRouter);

const routes = [
    { path: '/deck', component: Deck },
    { path: '/login', component: Login },
    { path: '/', component: Board }
];

window.socket = io('http://localhost:4001');


// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
    routes // short for routes: routes
});

new Vue({
    router,
    el: '#app',
    render: h => h(App)
});
