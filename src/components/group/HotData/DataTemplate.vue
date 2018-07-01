<template>
  <div>
    <div class="title">Data Template</div>

    <ul class="templateSection">
      <li :key="nc.cType" v-for="(nc) in newInfos">
        <div class="hover-highlight">
          <div class="sub-title">{{ nc.name }}</div>
          <div class="item-desc">{{ nc.desc }}</div>
        </div>
      </li>
    </ul>

  </div>
</template>

<script>
import * as Hot from './HotData.js'

export default {
  data () {
    return {
      newInfos: Hot.collectionTypes
    }
  }
}
</script>

<style scoped>
@import url(./Shared.css);
.templateSection *{
  cursor: url('./img/plus-arrow.svg'), pointer;
}
</style>
