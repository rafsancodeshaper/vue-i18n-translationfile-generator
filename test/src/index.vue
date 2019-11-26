<template>
  <div>{{ $t('Index.lblTitle') }}</div>
  <div>{{ $t('Index.lblU1') }}</div>
  <q-btn
    @click="$refs.stepper.next()"
    color="secondary"
    :label="val === 3 ? $t('Index.btnStart') : $t('Index.btnStop')"
  />
</template>

<script>
export default {};
</script>

<style>
</style>