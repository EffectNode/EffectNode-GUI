<template>
  <div class="landing font">
    <LandingBar></LandingBar>
    <ENOSArea v-if="ww >= 767"></ENOSArea>
    <HeroSliderLarge v-if="ww <= 767"></HeroSliderLarge>
    <DescRow></DescRow>
    <CTA></CTA>
    <Webby></Webby>
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
import ENOSArea from './Compos/ENOSArea.vue'
import FeatureList from './Compos/FeatureList.vue'
import Webby from './Compos/Webby.vue'

export default {
  components: {
    HeroSliderLarge,
    LandingBar,
    DescRow,
    FooterRow,
    CTA,
    FeatureList,
    ENOSArea,
    Webby
  },
  data () {
    return {
      ww: window.innerWidth
    }
  },
  mounted () {
    window.addEventListener('resize', () => {
      this.ww = window.innerWidth
    })
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
