import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import moment from 'moment-timezone';
moment.tz.setDefault('UTC'); // set default time zone

import axios from 'axios';

export default new Vuex.Store({
    state: {
        currentYear: 2018,
        currentMonth: 8,
        eventFormPosX: null,
        eventFormPosY: null,
        eventFormActive: false,
        events: [],
        eventFormDate: moment(), // null,
    },
    mutations: {
        setCurrentMonth(state, payload) {
            state.currentMonth = payload;
        },
        setCurrentYear(state, payload) {
            state.currentYear = payload;
        },
        eventFormPos(state, payload) {
            state.eventFormPosX = payload.x;
            state.eventFormPosY = payload.y;
        },
        eventFormActive(state, payload) {
            state.eventFormActive = payload;
        },
        addEvent(state, payload) {
            state.events.push(payload);

        },
        eventFormDate(state, payload) {
            state.eventFormDate = payload;
        }
    },
    actions: {
        addEvent(context, payload) {
            return new Promise((resolve, reject) => {
                let obj= {
                    description: payload,
                    date: context.state.eventFormDate
                };
                axios.post('/add_event', obj).then(response => {
                    if (response.status === 200) {
                        context.commit('addEvent', obj); // call to mutation
                        resolve();
                    } else {
                        reject();
                    }
                });
            });
        }
    }
})
