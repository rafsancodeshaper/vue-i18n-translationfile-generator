<template>
  <div>{{ $t('Page.Component.lblFirstnName') }}</div>
  <div>{{ $t('Page.Component.lblLastName') }}</div>
  <div>{{ $t('Page.Component.lblU1') }}</div>
  <div>{{ $t('Page.Component.lblU2') }}</div>
  <div>{{ $t('Page.Component1.lblU1') }}</div>
  <q-btn
    @click="$refs.stepper.next()"
    color="secondary"
    :label="step === 3 ? $t('pCalculator.btnEmailOffer') : $t('pCalculator.btnContinue')"
  />
</template>

<script>
export default {};
</script>

<style>
</style>