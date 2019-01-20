<template>
  <div class="landing font">
    <LandingBar></LandingBar>
    <HeroSliderLarge></HeroSliderLarge>
    <DescRow></DescRow>
    <CTA></CTA>
    <FeatureList></FeatureList>
    <FooterRow></FooterRow>
  </div>
</template>

<script>
import HeroSliderLarge from './Compos/HeroSliderLarge.vue'
import LandingBar from './Compos/LandingBar.vue'
import DescRow from './Compos/DescRow.vue'
import FooterRow from './Compos/FooterRow.vue'
import CTA from './Compos/CTA.vue'
import FeatureList from './Compos/FeatureList.vue'

export default {
  components: {
    HeroSliderLarge,
    LandingBar,
    DescRow,
    FooterRow,
    CTA,
    FeatureList
  }
}
</script>
<style>
  .landing .sys-constraint {
    width: calc(100% - 15px * 2);
    margin: 0px auto;
  }
  @media screen and (min-width: 413px) {
    .landing .sys-constraint {
      width: calc(100% - 15px * 2);
    }
  }
  @media screen and (min-width: 767px) {
    .landing .sys-constraint {
      width: calc(700px);
    }
  }
  @media screen and (min-width: 959px) {
    .landing .sys-constraint {
      width: calc(850px);
    }
  }
  @media screen and (min-width: 1440px) {
    .landing .sys-constraint {
      width: calc(1200px);
    }
  }
</style>
<style scoped>


</style>
