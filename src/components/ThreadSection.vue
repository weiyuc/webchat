<template>
    <div class="thread-section">
        <mt-search :model="searchValue">
        </mt-search>
        <ul class="thread-list">
            <thread
                v-for="thread in threads"
                :key="thread.id"
                :thread="thread"
                :active="thread.id === currentThread.id"
                @switch-thread="switchThread">
            </thread>
        </ul>
    </div>
</template>
<script>
    import Thread from './Thread.vue'
    import {mapGetters} from 'vuex'
    import MtSearch from "../../node_modules/mint-ui/packages/search/src/search";

    export default {
        name: 'ThreadSection',
        data() {
            return {
                searchValue: ''
            }
        },
        components: {MtSearch, Thread},
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