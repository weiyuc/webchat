<template>
    <div class="session-section">
        <!--
        <mt-search :model="searchValue">
        </mt-search>
        -->
        <ul class="session-list">
            <session
                v-for="session in sessions"
                :key="session.id"
                :session="session"
                :active="session.id === currentSession.id"
                @switch-session="switchSession">
            </session>
        </ul>
    </div>
</template>
<script>
    import Session from './Session.vue'
    import {mapGetters} from 'vuex'

    export default {
        name: 'SessionSection',
        data() {
            return {
                searchValue: ''
            }
        },
        components: {Session},
        computed: {
            ...mapGetters([
                'sessions',
                'currentSession'
            ])
        },
        methods: {
            switchSession (id) {
                this.$store.dispatch('switchSession', {id})
                this.$router.push({path: '/messageSection'})
            }
        }
    }
</script>
<style lang="scss">
    .mint-search {
        height: 52px;
        width: 100%;
    }
</style>