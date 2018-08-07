<template>
    <div :class="{ active: active }" id="event-form" :style="{ top: top, left: left }">
        <h4>Add an event</h4>
        <p> {{ date.format('dddd, MMM Do') }} </p>
        <div class="text">
            <input type="text" placeholder="Dinner at Pancho's" v-model="description" v-focus @keyup.enter="create">
        </div>
        <div class="buttons">
            <button @click="create">Create</button>
        </div>
        <button id="close-button" @click="close">&#10005;</button>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                description: ''
            };
        },
        computed: {
            active() {
                return  this.$store.state.eventFormActive;
            },
            top() {
                return `${this.$store.state.eventFormPosY}px`;
            },
            left() {
                return `${this.$store.state.eventFormPosX}px`;
            },
            date() {
                return this.$store.state.eventFormDate;
            }
        },
        methods: {
            close() {
                this.$store.commit('eventFormActive', false);
            },
            create() {
                if (this.description.length) {
                    // this.$store.commit('addEvent', this.description);
                    this.$store.dispatch('addEvent', this.description)
                    .then(_ => {
                        this.close();
                        this.description = '';
                    });

                }
            }
        },
        directives: {
            focus: {
                update(el) {
                    el.focus();
                }
            }
        }
    }
</script>
