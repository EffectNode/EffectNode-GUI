<template>
<div>
  <select v-model="previews.index">
    <option value="-1">Default</option>
    <option :key="iPreview" v-for="(preview, iPreview) in previews.choices" :value="iPreview">{{ preview.title }}</option>
  </select>
  <div :key="iPreview" v-for="(preview, iPreview) in previews.choices" v-if="iPreview === previews.index">
    <input type="text" v-model="preview.title">

    <div :key="iAttr" v-for="(attr, iAttr) in preview.attributes">
      {{ attr.name }}
      <h3>Settings</h3>
      <div :key="iSetting + 'attr'" v-for="(setting, iSetting) in attr.settings">
        Key: <input type="text" :value="setting.k">
        Value: <input type="text" v-model="setting.v" @keydown.enter="() => { forceRefresh({ preview }) }"> <br />
      </div>

      <h3>Formula</h3>
      <div :key="iSetting + 'eq'" v-for="(setting, iSetting) in attr.equations">
        Formula of {{ setting.k }}: <input class="formula" type="text" v-model="setting.v" @keydown.enter="() => { forceRefresh({ preview }) }"> <br />
      </div>
    </div>

    <button @click="forceRefresh({ preview })">Force Refresh</button>
  </div>
</div>
</template>

<script>
export default {
  props: {
    previews: {}
  },
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
    getKeys (v) {
      return Object.keys(v)
    },
    forceRefresh ({ preview }) {
      console.log(preview)
      preview.attributes = JSON.parse(JSON.stringify(preview.attributes))
      this.$forceUpdate()
    }
  }
}
</script>

<style scoped>
.formula{
  width: 300px;
}
.formula-output{
  width: 30px;
}
</style>
