<template>
    <div>
        <mt-header fixed :title="$t(title)"></mt-header>
        <div class="content">
            <mt-tab-container v-model="active">
                <mt-tab-container-item id="message">
                    <mt-search
                        v-model="searchWord"
                        :cancel-text='$t("msg.cancel")'
                        :placeholder='$t("msg.search")'>
                    </mt-search>
                    <mt-cell title="msg"></mt-cell>
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
    export default {
        name: 'index',
        data() {
            return {
                title: 'msg.message',
                active: 'message',
                searchWord: '',
            }
        },
        watch: {
            active: {
                handler: function (val, oldVal) {
                    this.title = `msg.${val}`;
                },
                immediate: true
            }
        }
    }
</script>
<style lang="scss">
    html {
        width: 100%;
        height: 100%;
        body {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            font-family: "Microsoft Sans Serif";
            font-size: 14px;
            >div {
                width: 100%;
                height: 100%;
                >div {
                    width: 100%;
                    height: 100%;
                    >.content {
                        width: 100%;
                        height: calc(100% - 95px);
                        padding: 40px 0 55px 0;
                        background-color: #f8f8f8;
                        .mint-search {
                            height: 52px;
                            width: 100%;
                        }
                    }
                }
            }
        }
    }
</style>