<template>
  <div class="wc-index">
    <v-toolbar color="primary" dark>
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title>{{$t(title)}}</v-toolbar-title>
    </v-toolbar>
    <div class="content" ref="content">
      <session-section v-show="active === 'message'"></session-section>
      <contact-section v-show="active === 'contact'"></contact-section>
      <me-section v-show="active === 'me'"></me-section>
    </div>

    <v-bottom-nav
      :active.sync="active"
      :value="true"
      absolute
      color="transparent">
      <v-btn
        color="teal"
        flat
        value="message">
        <span>{{ $t("msg.message") }}</span>
        <v-badge left>
          <template v-if="unreadMsgCount > 0" v-slot:badge>
            <span>{{unreadMsgCountFormat}}</span>
          </template>
          <v-icon
            large>
            chat_bubble
          </v-icon>
        </v-badge>
      </v-btn>

      <v-btn
        color="teal"
        flat
        value="contact">
        <span>{{ $t("msg.contact") }}</span>
        <v-badge left>
          <template v-if="unreadReqCount > 0" v-slot:badge>
            <span>{{unreadReqCountFormat}}</span>
          </template>
          <v-icon
            large>
            group
          </v-icon>
        </v-badge>
      </v-btn>
      <v-btn
          color="teal"
          flat
          value="me">
        <span>{{ $t("msg.me") }}</span>
        <v-icon
          large>
          person
        </v-icon>
      </v-btn>
    </v-bottom-nav>
  </div>
</template>
<script>
  import SessionSection from '../components/Index/SessionSection'
  import ContactSection from "../components/Index/ContactSection"
  import MeSection from "../components/Index/MeSection"
  import {mapGetters} from 'vuex'

  export default {
    name: 'wc-index',
    components: {
      MeSection, ContactSection, SessionSection
    },
    data() {
      return {
        searchWord: '',
        messages: []
      }
    },
    computed: {
      ...mapGetters([
        'unreadMsgCount',
        'unreadReqCount'
      ]),
      title() {
        return `msg.${this.active}`
      },
      unreadMsgCountFormat() {
        return this.unreadMsgCount > 99 ? '99+' : this.unreadMsgCount
      },
      unreadReqCountFormat() {
        return this.unreadReqCount > 99 ? '99+' : this.unreadReqCount
      },
      active: {
        get () {
          return this.$store.getters.active
        },
        set (value) {
          this.$Lazyload.lazyLoadHandler()
          this.$store.commit('setActive', value)
        }
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
      height: calc(100% - 121px);
      overflow-y: auto;
    }
    .v-bottom-nav {
      height: 65px !important;
    }
  }
</style>