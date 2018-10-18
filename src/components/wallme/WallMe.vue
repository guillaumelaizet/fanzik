<template lang="html">
  <h1>Wall Page state</h1>
</template>

<script>
import Service from '../../service/Service'

export default {
  name: 'wallme',

  created: function () {
    Service.instance.fetchMe().then((response) => {
      console.log(response)
    })
  }
}

</script>

<style lang="css">
</style>
