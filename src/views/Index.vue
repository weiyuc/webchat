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
        <mt-badge size="small" color="red" v-show="unreadMsgCount">
          {{ unreadMsgCount }}
        </mt-badge>
        <i slot="icon" class="icon icon-bubble2"></i>
        {{ $t("msg.message") }}
      </mt-tab-item>
      <mt-tab-item id="contact">
        <i slot="icon" class="icon icon-users"></i>
        <mt-badge size="small" color="red" v-show="unreadReqCount">
          {{ unreadReqCount }}
        </mt-badge>
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
  import SessionSection from '../components/SessionSection'
  import ContactSection from "../components/ContactSection"
  import MeSection from "../components/MeSection"

  export default {
    name: 'wc-index',
    components: {
      MeSection, ContactSection, SessionSection
    },
    data() {
      return {
        searchWord: '',
        messages: [],
        height: 0
      }
    },
    computed: {
      title() {
        return `msg.${this.active}`
      },
      unreadMsgCount() {
        return this.$store.state.unreadMsgCount > 99 ? '99+' : this.$store.state.unreadMsgCount
      },
      unreadReqCount() {
        return this.$store.state.unreadReqCount > 99 ? '99+' : this.$store.state.unreadReqCount
      },
      active: {
        get () {
          return this.$store.state.active
        },
        set (value) {
          this.$store.commit('setActive', value)
        }
      }
    },
    mounted() {
      this.height = this.$refs.content.clientHeight
    }
  }
</script>
<style lang="scss">
</style>