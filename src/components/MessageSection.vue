<template>
    <div class="message-section">
        <mt-header fixed :title="session.name">
            <a href="javascript:;" slot="left" @click="back">
                <mt-button icon="back">{{$t('msg.back')}}</mt-button>
            </a>
        </mt-header>
        <ul class="message-list" ref="list">
            <message
                    v-for="message in sortedMessages"
                    :key="message.id"
                    :message="message">
            </message>
        </ul>
        <mt-field v-model="msg" @keyup.enter="sendMessage">
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
    .message-section {
        >.mint-cell {
            position: fixed;
            bottom: 0;
            width: 100%;
            border-top: 1px solid #ccc;
        }
    }
</style>
