<template>
    <div>
        <div id="header">
            <div>
                <img src="../assets/logo.png">
                <h1>Vue.js Calendar</h1>
            </div>
            <div>
                <current-month></current-month>
            </div>
        </div>
        <div id="day-bar">
            <div v-for="day in weekDays">{{ day }}</div>
        </div>
        <div id="calendar">
            <div class="calendar-week" v-for="week in weeks">
                <calendar-day v-for="day in week" :day="day"></calendar-day>
            </div>
        </div>
        <event-form></event-form>
    </div>
</template>

<script>
    import CalendarDay from './CalendarDay.vue';
    import CurrentMonth from './CurrentMonth.vue';
    import EventForm from './EventForm.vue';

    export default {
        data() {
            return {
                weekDays: ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun']
            };
        },
        computed: {
            days() {
                let days = [];
                let currentDay = this.$moment(`${this.year}-${this.month}-1`,
                    'YYYY/M/D');
                do {
                    days.push(currentDay);
                    currentDay = this.$moment(currentDay).add(1, 'days'); // need to create new instance because ref semantics
                } while(currentDay.month() + 1 === this.month); // month() is 0-based

                // Add previous days to start
                currentDay = this.$moment(days[0]); // get first day
                const MONDAY = 1;
                while (currentDay.day() !== MONDAY) { // day() treat Sun as 0 and Mon as 1
                    currentDay = this.$moment(currentDay).subtract(1, 'days');
                    days.unshift(currentDay); // unshift() pushes to start of array
                }

                // Add following days to end
                currentDay = this.$moment(days[days.length - 1]); // get first day
                const SUNDAY = 0;
                while(currentDay.day() !== SUNDAY) {
                    currentDay = this.$moment(currentDay).add(1, 'days');
                    days.push(currentDay);
                }

                return days;
            },
            weeks() {
                let weeks = []; // each entry is an array of the days in the week
                let week = [];

                for (let day of this.days) {
                    week.push(day);
                    if (week.length === 7) {
                        weeks.push(week);
                        week = [];
                    }
                }

                return weeks;
            },
            month() {
                return this.$store.state.currentMonth;
            },
            year() {
                return this.$store.state.currentYear;
            }
        },
        components: {
            CalendarDay,
            CurrentMonth,
            EventForm
        },
        created() {
            console.log(this.$moment);
        }
    }
</script>
