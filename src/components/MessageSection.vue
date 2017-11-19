<template>
    <div class="message">
        <mt-header fixed :title="session.name">
            <a href="javascript:;" slot="left" @click="back">
                <mt-button icon="back">{{$t('msg.back')}}</mt-button>
            </a>
        </mt-header>
        <div class="message-section">

            <ul class="message-list" ref="list">
                <message
                        v-for="message in sortedMessages"
                        :key="message.id"
                        :message="message">
                </message>
            </ul>

        </div>
        <mt-field v-model="msg" @keyup.enter="sendMessage" class="bottom-input">
            <mt-button type="primary" size="small" @click="sendMessage">{{$t('msg.send')}}</mt-button>
        </mt-field>
    </div>
</template>

<script>
    import Message from './Message.vue'
    import {mapGetters} from 'vuex'

    export default {
        name: 'MessageSection',
        components: {Message},
        data() {
            return {
                msg: ''
            }
        },
        computed: {
            ...mapGetters({
                session: 'currentSession',
                messages: 'currentMessages'
            }),
            sortedMessages () {
                return this.messages
                    .slice()
                    .sort((a, b) => a.timestamp - b.timestamp)
            }
        },
        watch: {
            'session.lastMessage': function () {
                this.$nextTick(() => {
                    const ul = this.$refs.list
                    ul.scrollTop = ul.scrollHeight
                })
            }
        },
        methods: {
            sendMessage () {
                if (this.msg) {
                    this.$store.dispatch('sendMessage', {
                        text: this.msg,
                        session: this.session
                    })
                    this.msg = ''
                }
            },
            back() {
                this.$store.dispatch('clearSession')
                this.$router.push({path: '/'})
            }
        }
    }
</script>
<style lang="scss">
    .message{
        width: 100%;
        height: 100%;
        .message-section {
            padding: 40px 0 48px 0;
            height: calc(100% - 89px);
            max-height: calc(100% - 89px);
            .message-list {
                height: 100%;
                overflow-y: auto;
            }
        }
        .bottom-input {
            border-top: 1px solid #ccc;
            width: 100%;
            position: fixed;
            bottom: 0;
        }
    }
</style>
