<template lang="html">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

  name: 'popupauth',
  data () {
    return {
      show: false
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
