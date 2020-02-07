
<template>
  <q-page ref="calculatorPage" padding>
    <q-ajax-bar ref="bar" position="top" size="10px" skip-hijack />
    <q-stepper
      keep-alive
      v-model="step"
      active-color="secondary"
      done-color="primary"
      animated
      ref="stepper"
    >
      <q-step :name="1" :title="$t('pCalculator.qStepper.stpDraw')" icon="draw" :done="step > 1">
        <div class="row">
          <div class="col-8">
            <sketcher ref="sketcher" @done="sketchFinished" class="sketcher"></sketcher>
          </div>
          <div class="col-4">
            <terrace-info-editor
              id="pnlTerraceDescription"
              @tileSizeChange="updateSketcherBackground"
            ></terrace-info-editor>
          </div>
        </div>
      </q-step>
      <q-step :name="2" :title="$t('pCalculator.qStepper.stpCalculate')">
        <div class="row">
          <div class="col-6">
            <person-info-editor @PolicyAccepted="policyAccepted"></person-info-editor>
          </div>
          <div class="col"></div>
        </div>
      </q-step>
      <q-step :name="3" :title="$t('pCalculator.qStepper.stpPrint')" :done="step > 2">
        <q-banner
          v-if="calculationError"
          class="text-white calculation-error q-mb-sm"
        >{{calculationError}}</q-banner>
        <div id="offer">
          <terrace-info :sketch="sketch"></terrace-info>
          <calculation-result-option
            v-for="(option, index) of options"
            :key="index"
            :option="option"
          ></calculation-result-option>
        </div>
        <!-- <q-btn :loading="calculating" color="grey" @calculate="calculate()">
          <template v-slot:loading>
            <q-spinner-hourglass class="on-left" />
            {{ $t('pCalculator.qStepper.btnCalculate.lblCalculating') }}
          </template>
          {{ $t('pCalculator.qStepper.btnCalculate.lblCalculate') }}
        </q-btn>-->
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn
            class="btn-stepper-next"
            @click="nextStep()"
            color="secondary"
            :label="lblStep"
            :disable="step === 2 && !allowPrint"
          />
          <q-btn
            v-if="step > 1"
            flat
            color="secondary"
            @click="$refs.stepper.previous()"
            :label="$t('pCalculator.qStepper.btnBack')"
            class="btn-stepper-back q-ml-sm"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </q-page>
</template>