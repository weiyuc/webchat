<template>
  <transition name="fade">
    <div class="wc-profiles">
      <mt-header fixed :title="$t('msg.profiles')">
        <a href="javascript:;" slot="left" @click="back">
          <mt-button icon="back">{{$t('msg.back')}}</mt-button>
        </a>
      </mt-header>
      <div style="width: 100%;height: 40px"></div>
      <mt-cell class="mt-20 photo" @click.native="imgUploadShow = true" is-link :title="$t('msg.profilePhoto')">
        <wc-profile-photo :myself="true" ></wc-profile-photo>
        <img v-show="imgData !== ''" :src="imgData" width="44" height="44"/>
      </mt-cell>
      <wc-img-upload v-if="imgUploadShow" @cancel="imgUploadShow = false" @onSelected="onSelected"></wc-img-upload>

      <mt-cell is-link @click.native="setRealName" :title="$t('msg.realName')" :value="realName"></mt-cell>
      <mt-cell title="Webchat ID" :value="username"></mt-cell>
      <mt-cell is-link @click.native="showGenderPicker" :title="$t('msg.gender')" :value="$t(formatGender)"></mt-cell>
      <mt-cell is-link @click.native="setWhatUp" :title="$t('msg.whatUp')" :value="whatUp"></mt-cell>

      <mt-popup
        v-model="popupVisible"
        position="bottom" style="width: 100%;">
        <mt-picker :slots="slots" ref="picker" @change="onValuesChange"></mt-picker>
      </mt-popup>
    </div>
  </transition>
</template>
<script>
  import Vue from 'vue'
  import {mapGetters} from 'vuex'
  import {MessageBox, Toast, Indicator} from 'mint-ui'
  import {uuidv4} from '../utils'
  import lrz from 'lrz'
  import WcProfilePhoto from "../components/ProfilePhoto";
  import WcImgUpload from "../components/ImageUpload";

  export default {
    components: {WcImgUpload, WcProfilePhoto}, name: 'wc-settings',
    data() {
      return {
        popupVisible: false,
        slots: [
        ],
        checkIndex: this.index,
        inputId: uuidv4(),
        imgData: '',
        imgUploadShow: false
      }
    },
    computed: {
      ...mapGetters([
        'username',
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
              if (value && value.length > 20) {
                Toast(this.$t('msg.enterWith20'))
                return
              }
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
              if (value && value.length > 150) {
                Toast(this.$t('msg.enterWith150'))
                return
              }
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
      onSelected(profilePhoto) {
        this.imgUploadShow = false
        Indicator.open()
        this.$store.dispatch('setProfilePhoto', {
          profilePhoto
        }).then(() => {
          Indicator.close()
        }).catch(() => {
          Indicator.close()
        })
      }
    }
  }
</script>
<style lang="scss">
  .wc-profiles {
    .photo {
      height: 70px;
      .mint-cell-wrapper {
        height: 100%;
      }
      img {
        border-radius: 5px;
      }
    }
    .cell-icon {
      font-size: 24px;
      vertical-align: middle;
    }
  }
</style>