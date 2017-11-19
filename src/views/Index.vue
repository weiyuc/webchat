<template>
    <div class="wc-index">
        <mt-header fixed :title="$t(title)"></mt-header>
        <div class="content" ref="content">
            <mt-tab-container v-model="active">
                <mt-tab-container-item id="message">
                    <session-section></session-section>
                </mt-tab-container-item>
                <mt-tab-container-item id="contact">
                    <contact-section :height="height"></contact-section>
                </mt-tab-container-item>
                <mt-tab-container-item id="me">
                    <me-section></me-section>
                </mt-tab-container-item>
            </mt-tab-container>
        </div>
        <mt-tabbar v-model="active">
            <mt-tab-item id="message">
                <mt-badge size="small" color="red" v-show="$store.state.unreadCount">
                    {{ $store.state.unreadCount > 99 ? '99+' : $store.state.unreadCount}}
                </mt-badge>
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
    import SessionSection from '../components/SessionSection.vue'
    import ContactSection from "../components/ContactSection";
    import MeSection from "../components/MeSection";

    export default {
        name: 'wc-index',
        components: {
            MeSection, ContactSection, SessionSection
        },
        data() {
            return {
                active: 'message',
                searchWord: '',
                messages: [],
                height: 0
            }
        },
        computed: {
            title: function() {
                return `msg.${this.active}`
            }
        },
        mounted() {
            this.height = this.$refs.content.clientHeight
        }
    }
</script>
<style lang="scss">
    .wc-index {
        width: 100%;
        height: 100%;
        > .content {
            width: 100%;
            position: fixed;
            top: 40px;
            bottom: 55px;
            height: calc(100% - 95px);
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
        .mint-tabbar {
            position: fixed !important;
        }
    }
</style>