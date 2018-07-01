<template>
  <div>


    <div class="hr"></div>

    <input type="range" :min="-PI" :max="PI" step="0.0001" v-model="mounter.x" @input="mounter.x = Number(mounter.x);" />
    <input type="number" :min="-PI" :max="PI" step="0.0001" v-model="mounter.x" @input="mounter.x = Number(mounter.x);" />
    x
    <br />

    <input type="range" :min="-PI" :max="PI" step="0.0001" v-model="mounter.y" @input="mounter.y = Number(mounter.y);" />
    <input type="number" :min="-PI" :max="PI" step="0.0001" v-model="mounter.y" @input="mounter.y = Number(mounter.y);" />
    y
    <br />

    <input type="range" :min="-PI" :max="PI" step="0.0001" v-model="mounter.z" @input="mounter.z = Number(mounter.z);" />
    <input type="number" :min="-PI" :max="PI" step="0.0001" v-model="mounter.z" @input="mounter.z = Number(mounter.z);" />
    z
    <br />

    <!-- <Rotater style="width: 200px; height: 200px;" @rotation="(v) => { root.rotation = v; }" /> -->
    <textarea v-model="mounter.note" @input="commitObj(mounter)" cols="30" rows="10"></textarea>


  </div>
</template>

<script>
export default {
  props: {
    mounter: {
      default () {
        return {}
      }
    }
  }
}
</script>

<style>

</style>
