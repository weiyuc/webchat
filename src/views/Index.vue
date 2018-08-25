<template>
  <transition name="fade">
    <div class="wc-index">
      <mt-header fixed :title="$t(title)"></mt-header>
      <div class="content" ref="content">
        <mt-tab-container v-model="active">
          <mt-tab-container-item id="message">
            <session-section :height="height"></session-section>
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
            {{ unreadMsgCountFormat }}
          </mt-badge>
          <i slot="icon" class="icon icon-bubble2"></i>
          {{ $t("msg.message") }}
        </mt-tab-item>
        <mt-tab-item id="contact">
          <i slot="icon" class="icon icon-users"></i>
          <mt-badge size="small" color="red" v-show="unreadReqCount">
            {{ unreadReqCountFormat }}
          </mt-badge>
          {{ $t("msg.contact") }}
        </mt-tab-item>
        <mt-tab-item id="me">
          <i slot="icon" class="icon icon-user"></i>
          {{ $t("msg.me") }}
        </mt-tab-item>
      </mt-tabbar>
    </div>
  </transition>
</template>
<script>
  import SessionSection from '../components/SessionSection'
  import ContactSection from "../components/ContactSection"
  import MeSection from "../components/MeSection"
  import {mapGetters} from 'vuex'

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
    },
    created() {
      this.height = document.documentElement.clientHeight - 95
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
      left: 0;
      height: calc(100% - 95px);
      background-color: #f8f8f8;
      > .mint-tab-container {
        width: 100%;
        height: 100%;
        > .mint-tab-container-wrap {
          width: 100%;
          height: 100%;
          > .mint-tab-container-item {
            width: 100%;
            height: 100%;
            overflow: auto;
          }
        }
      }
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