<template>
    <div class="wc-index">
        <mt-header fixed :title="$t(title)"></mt-header>
        <div class="content">
            <mt-tab-container v-model="active">
                <mt-tab-container-item id="message">
                    <thread-section></thread-section>
                </mt-tab-container-item>
                <mt-tab-container-item id="contact">
                    <mt-cell title="contact"></mt-cell>
                </mt-tab-container-item>
                <mt-tab-container-item id="me">
                    <mt-cell title="me"></mt-cell>
                </mt-tab-container-item>
            </mt-tab-container>
        </div>
        <mt-tabbar v-model="active">
            <mt-tab-item id="message">
                <mt-badge size="small" color="red" v-show="$store.state.unreadCount">{{ $store.state.unreadCount }}</mt-badge>
                <i slot="icon" class="icon icon-bubble2"></i>
                {{ $t("msg.message") }}
            </mt-tab-item>
            <mt-tab-item id="contact">
                <i slot="icon" class="icon icon-users"></i>
                {{ $t("msg.contact") }}
            </mt-tab-item>
            <mt-tab-item id="me">
                <i slot="icon" class="icon icon-user"></i>
                {{ $t("msg.me") }}
            </mt-tab-item>
        </mt-tabbar>
    </div>
</template>
<script>
    import ThreadSection from './ThreadSection.vue'
    import MessageSection from './MessageSection.vue'
    import {mapGetters} from 'vuex'

    export default {
        name: 'wc-index',
        components: {
            ThreadSection,
            MessageSection
        },
        data() {
            return {
                title: 'msg.message',
                active: 'message',
                searchWord: '',
                messages: []
            }
        },
        computed: {
            ...mapGetters([
                'threads'
            ]),
            unreadCount () {
                const threads = this.threads
                return Object.keys(threads).reduce((count, id) => {
                    return count += threads[id].unreadCount
                }, 0)
            }
        },
        watch: {
            active: {
                handler: function (val, oldVal) {
                    this.title = `msg.${val}`;
                },
                immediate: true
            },
            unreadCount: {
                handler: function (val, oldVal) {
                    console.log('unreadCount:', val);
                },
                immediate: true,
                deep: true
            }
        }
    }
</script>
<style lang="scss">
    .wc-index {
        width: 100%;
        height: 100%;
        > .content {
            width: 100%;
            height: calc(100% - 95px);
            max-height: calc(100% - 95px);
            padding: 40px 0 55px 0;
            background-color: #f8f8f8;
            overflow-y: auto;
        }
        .mint-tab-item-label {
            position: relative;
            .mint-badge {
                position: absolute;
                top: -38px;
                right: 35px;
            }
        }
    }
</style>