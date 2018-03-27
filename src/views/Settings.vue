<template>
  <div class="wc-settings">
    <mt-header :title="$t('msg.settings')">
      <a href="javascript:;" slot="left" @click="back">
        <mt-button icon="back">{{$t('msg.back')}}</mt-button>
      </a>
    </mt-header>

    <mt-cell is-link @click.native="setRealName" class="mt-20" :title="$t('msg.realName')" :value="realName"></mt-cell>
    <mt-cell is-link @click.native="showGenderPicker" :title="$t('msg.gender')" :value="$t(formatGender)"></mt-cell>
    <mt-cell is-link @click.native="setWhatUp" :title="$t('msg.whatUp')" :value="whatUp"></mt-cell>

    <mt-radio
      :title="$t('msg.lang')"
      v-model="lang"
      :options="[{label: $t('msg.zh'), value: 'zh'}, {label: $t('msg.en'), value: 'en'}]">
    </mt-radio>

    <div class="logout-btn">
      <mt-button type="danger" size="large" @click.native="logout">{{ $t('msg.logout') }}</mt-button>
    </div>

    <mt-popup
      v-model="popupVisible"
      position="bottom" style="width: 100%;">
      <mt-picker :slots="slots" ref="picker" @change="onValuesChange"></mt-picker>
    </mt-popup>
  </div>
</template>
<script>
  import Vue from 'vue'
  import {mapGetters} from 'vuex'
  import {MessageBox, Toast, Indicator} from 'mint-ui'

  export default {
    name: 'wc-settings',
    data() {
      return {
        lang: Vue.config.lang,
        popupVisible: false,
        slots: [
        ],
        checkIndex: this.index
      }
    },
    computed: {
      ...mapGetters([
        'realName',
        'gender',
        'whatUp'
      ]),
      index() {
        return this.gender === 0 ? 2 : this.gender === 1 ? 1 : 0
      },
      formatGender() {
        return this.gender === 0 ? 'msg.female' : this.gender === 1 ? 'msg.male' : 'msg.empty'
      }
    },
    watch: {
      lang: function(newLang) {
        this.$i18n.locale = newLang
        try {
          window.localStorage.lang = newLang
        } catch (e) {
          alert('Your web browser does not support storing settings locally. In Safari, the most common cause of this is using "Private Browsing Mode". Some settings may not save or some features may not work properly for you.');
        }
      },
      popupVisible: function(newVal) {
        if (!newVal) {
          if (this.checkIndex !== this.index) {
            let gender = this.checkIndex === 0 ? null : this.checkIndex === 1 ? 1 : 0
            this.$store.dispatch('setGender', {
              gender
            })
          }
        }
      }
    },
    methods: {
      back() {
        this.$store.dispatch('clearSession').then(
          () => {
            window.history.length > 1
              ? this.$router.go(-1)
              : this.$router.push('/')
          }
        )
      },
      setRealName() {
        let config = {
          confirmButtonText: this.$t('msg.confirm'),
          cancelButtonText: this.$t('msg.cancel'),
          inputPlaceholder: this.realName
        }
        MessageBox.close()
        this.$nextTick(() => {
          MessageBox.prompt(this.$t('msg.realName'), config).then(
            ({ value }) => {
              let realName = value
              this.$store.dispatch('setRealName', {
                realName
              })
            },
            () => {
              //Do nothing
            }
          )
        })
      },
      showGenderPicker() {
        this.slots = [
          {
            values: [this.$t('msg.empty'), this.$t('msg.male'), this.$t('msg.female')],
            defaultIndex: this.index
          }
        ]

        this.$nextTick(() => {
          this.$refs['picker'].setSlotValue(0, this.$t(this.formatGender))
        })

        this.popupVisible = true
      },
      onValuesChange(picker, values) {
        if (picker.slots.length > 0) {
          this.checkIndex = picker.slots[0].values.indexOf(values[0])
        }
      },
      setWhatUp() {
        let config = {
          confirmButtonText: this.$t('msg.confirm'),
          cancelButtonText: this.$t('msg.cancel'),
          inputPlaceholder: this.whatUp
        }
        MessageBox.close()
        this.$nextTick(() => {
          MessageBox.prompt(this.$t('msg.whatUp'), config).then(
            ({ value }) => {
              let whatUp = value
              this.$store.dispatch('setWhatUp', {
                whatUp
              })
            },
            () => {
              //Do nothing
            }
          )
        })
      },
      logout() {
        let config = {
          confirmButtonText: this.$t('msg.confirm'),
          cancelButtonText: this.$t('msg.cancel')
        }
        MessageBox.close()
        MessageBox.confirm(
          `${this.$t('msg.confirmLogout')}`,
          this.$t('msg.tips'),
          config).then(() => {
          this.$store.dispatch('logout').then(
            () => {
              this.$router.push({path: '/login'})
            }
          )
        }).catch(
          () => {
          }
        )
      }
    }
  }
</script>
<style lang="scss">
  .wc-settings {
    .logout-btn {
      width: 80%;
      text-align: center;
      margin: 30px auto 0 auto;
    }
    .cell-icon {
      font-size: 24px;
      vertical-align: middle;
    }
  }
</style>