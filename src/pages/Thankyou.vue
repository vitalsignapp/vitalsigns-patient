<template>
  <div>
    <div class="absolute-center">
      <div align="center">
        <q-img style="width:145px" src="../statics/pic/illus-sunny.png"></q-img>
      </div>
      <div class="font-h3" align="center">
        <span>{{ $t('thankHeader') }}</span>
      </div>
      <div class="font-body q-py-lg" align="center">
        <span>{{ $t('thankBody') }}</span>
      </div>
      <div align="center" class="q-pt-md">
        <q-btn dense class="button-action" to="/vitalsign/schedule">
          <span>{{ $t('backToHome') }}</span>
        </q-btn>
      </div>
    </div>
    <div align="center" class="text-teal font-body absolute-bottom q-pb-md">
      <a href style="text-decoration:none">
        <span>{{ $t('feedback') }}</span>
      </a>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
</style>