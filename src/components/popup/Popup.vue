<template lang="html" ref="modal">
  <div description="popup">
    <div class="modal-mask" v-on:click="close" v-show="show" transition="modal">
      <div class="modal-wrapper">
        <div class="modal-container" v-on:click.stop>

          <div class="modal-header">
            <slot name="header">
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <!-- Default button -->
              <div class="modal-button noselect" style="margin: 8px; font-size: 12pt;" v-on:click="onDefaultOkButtonPressed($event)">
                <span class="v-aligned-child" style="vertical-align: -30px; text-align: center">{{defaultButtonTitle}}</span>
              </div>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/babel">
// import Vue from 'vue'

export default {

  name: 'popup',
  data () {
    return {
      show: false,
      defaultButtonTitle: 'OK'
    }
  },

  created: function () {
    document.addEventListener('keydown', (jsEvent) => {
      if (this.show & jsEvent.keyCode === 27) {
        this.close()
      }
    })

    // Vue.transition('modal', {
    //   afterLeave: function (el) {
    //     Vue.nextTick(() => { this.onClose() })
    //   }
    // })
  },

  methods: {
    close: function () {
      this.show = false
      console.log('popup closed')
    },

    onDefaultOkButtonPressed: function () {
      this.close()
    }
  }
}
</script>

<style src="./Popup.scss" lang="scss">
</style>
