<template>
  <div class="landing font">
    <TitleBar></TitleBar>
    <HeroSlider></HeroSlider>
    <DescRow></DescRow>
    <FooterRow></FooterRow>
  </div>
</template>

<script>
import HeroSlider from './Compos/HeroSlider.vue'
import TitleBar from './Compos/TitleBar.vue'
import DescRow from './Compos/DescRow.vue'
import FooterRow from './Compos/FooterRow.vue'

export default {
  components: {
    HeroSlider,
    TitleBar,
    DescRow,
    FooterRow
  }
}
</script>
<style>
  .sys-constraint {
    width: calc(100% - 15px * 2);
    margin: 0px auto;
  }
  @media screen and (min-width: 413px) {
    .sys-constraint {
      width: calc(100% - 15px * 2);
    }
  }
  @media screen and (min-width: 767px) {
    .sys-constraint {
      width: calc(700px);
    }
  }
  @media screen and (min-width: 959px) {
    .sys-constraint {
      width: calc(850px);
    }
  }
  @media screen and (min-width: 1440px) {
    .sys-constraint {
      width: calc(1200px);
    }
  }
</style>
<style scoped>


</style>
