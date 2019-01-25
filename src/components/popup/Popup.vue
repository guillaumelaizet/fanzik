<template lang="html" ref="modal">
  <div description="popup">
    <div class="modal-mask" v-on:click="close" v-show="show" transition="modal">
      <div class="modal-wrapper">
        <div class="modal-container" v-on:click.stop>
          <div class="modal-body">
            <slot name="body">
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/babel">

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
