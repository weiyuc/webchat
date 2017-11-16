<template>
    <div class="thread-section">
        <mt-search :model="searchValue">
        </mt-search>
        <ul class="thread-list">
            <session
                v-for="thread in threads"
                :key="thread.id"
                :thread="thread"
                :active="thread.id === currentThread.id"
                @switch-thread="switchThread">
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
                'threads',
                'currentThread'
            ])
        },
        methods: {
            switchThread (id) {
                this.$store.dispatch('switchThread', {id})
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