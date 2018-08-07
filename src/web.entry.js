import './style.scss';
import moment from 'moment-timezone';
moment.tz.setDefault('UTC'); // set default time zone

let events = window.__INITIAL_STATE__.map(event => {
    return {
        description: event.description,
        date: moment(event.date)
    }
})

import VueCalendar from './entry';

// If you create a Vue instance without an el element, then you can use $mount
// to mount the instance onto html template
VueCalendar(events).$mount('#app');
