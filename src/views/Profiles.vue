<template>
  <div class="wc-profiles">
    <mt-header :title="$t('msg.profiles')">
      <a href="javascript:;" slot="left" @click="back">
        <mt-button icon="back">{{$t('msg.back')}}</mt-button>
      </a>
    </mt-header>

    <mt-cell class="mt-20 photo" @click.native="selPhoto" is-link :title="$t('msg.profilePhoto')">
      <wc-profile-photo :myself="true" v-show="imgData === ''" ></wc-profile-photo>
      <mt-button @click.native="uploadImg" v-show="imgData !== ''" :plain="true" type="primary">上传</mt-button>
      <img v-show="imgData !== ''" :src="imgData" width="44" height="44"/>
    </mt-cell>
    <input :id="inputId" @change="handleChange" style="display: none" type="file" accept="image/*"/>

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
</template>
<script>
  import Vue from 'vue'
  import {mapGetters} from 'vuex'
  import {MessageBox, Toast, Indicator} from 'mint-ui'
  import {uuidv4} from '../utils'
  import lrz from 'lrz'
  import WcProfilePhoto from "../components/ProfilePhoto";

  export default {
    components: {WcProfilePhoto}, name: 'wc-settings',
    data() {
      return {
        lang: Vue.config.lang,
        popupVisible: false,
        slots: [
        ],
        checkIndex: this.index,
        inputId: uuidv4(),
        imgData: ''
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
      selPhoto() {
        document.getElementById(this.inputId).click();
      },
      handleChange(e) {
        if (!e.target.files[0]) {
          console.log('no file found')
          return;
        }
        let vm = this;
        lrz(e.target.files[0], {quality: 0.5, width: 44, height: 44}).then(function (rst) {
          if (rst.base64Len > 1024 * 1024) {
            vm.imgData = ''
            Toast('图片不能超过1MB')
            return;
          }
          vm.imgData = rst.base64
        }).catch(function (err) {
          Toast('压缩图片失败')
        });
      },
      uploadImg(e) {
        e.stopPropagation()
        let profilePhoto = this.imgData
        this.$store.dispatch('setProfilePhoto', {
          profilePhoto
        }).then(() => {
          this.imgData = ''
        }).catch(() => {
        })
      }
    }
  }
</script>
<style lang="scss">
  .wc-profiles {
    .photo {
      button {
        width: 40px;
        height: 25px;
        font-size: 12px;
        padding: 0 5px;
        position: absolute;
        right: 90px;
        top: 12px;
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