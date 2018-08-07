// Shared file between server and web entry
import Vue from 'vue';

import store from './store';

import moment from 'moment-timezone';
moment.tz.setDefault('UTC'); // set default time zone
Object.defineProperty(Vue.prototype, '$moment', { get() { return this.$root.moment }});

import App from './components/App.vue';

export default function(events) {
    // start with empty object and merge with store.state, then override events
    let initialState = Object.assign({}, store.state, { events });
    store.replaceState(initialState); // must replace every state property

    return new Vue({
        // el: '#app', // not needed because server won't have template
        data: {
        moment
        },
        components: {
            App
        },
        store,
        render(createElement) {
            return createElement(
                'div',
                { attrs: { id: 'app' }},
                [
                    createElement('app')
                ]
            )
        }
    });
}
