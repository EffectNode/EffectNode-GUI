<template>
  <div class="full animation-app">
    <TitleBar :portal="portal"  @click="$emit('click')" :uiAPI="uiAPI">
      Animation
    </TitleBar>
    <div class="content-div" @click="$emit('click')" v-if="quotesInfo" >
      <!-- <Deck v-if="quotesInfo" ref="deck" :info="quotesInfo.data"></Deck> -->
      <Flipper :info="quotesInfo.data" ref="flipper" v-show="mode === 'flipper'"></Flipper>
      <Deck :info="quotesInfo.data" ref="deck" v-show="mode === 'deck'"></Deck>
      <Messages :info="quotesInfo.data" ref="messages" v-show="mode === 'messages'"></Messages>
      <Tower :info="quotesInfo.data" ref="tower" v-show="mode === 'tower'"></Tower>

      <div class="floating-switcher">
        <button @click="mode = 'messages'">Messages</button>
        <button @click="mode = 'tower'">Tower</button>
        <button @click="mode = 'flipper'">Flipper</button>
        <button @click="mode = 'deck'">Deck</button>
      </div>
    </div>
  </div>
</template>

<script>
// import axios from 'axios'
import TitleBar from '../TitleBar'
import Flipper from './Flipper'
import Tower from './Tower'
import Deck from './Deck'
import Messages from './Messages'

export default {
  props: {
    uiAPI: {},
    portal: {}
  },
  components: {
    TitleBar,
    Flipper,
    Tower,
    Deck,
    Messages
  },
  data () {
    return {
      mode: 'tower',
      quotesInfo: false
    }
  },
  mounted () {
    // axios.get('http://www.wonglok.com/quotes?as=json')
    //   .then(r => {
    //     console.log(r.data)
    //     this.quotesInfo = r.data
    //     this.quotesInfo.data = this.quotesInfo.data.map((t) => { t.text = this.escapeHtml(t.text); return t })
    //   })
  },
  methods: {
    escapeHtml (text) {
      var encodedStr = text
      var parser = new DOMParser()
      var dom = parser.parseFromString(
        '<!doctype html><body>' + encodedStr,
        'text/html'
      )
      var decodedString = dom.body.textContent
      return decodedString
    }
  }
}
</script>

<style scoped>
@import url(../../jot.css);

.animation-app{
  /* background: linear-gradient(90deg, #4b6cb7 0%, #182848 100%); */
  box-sizing: border-box;
  border-radius: 10px 10px 10px 10px;
/* background-image: radial-gradient( circle farthest-corner at 10% 20%,  rgba(149,219,254,1) 0%, rgba(7,134,197,1) 90.1% ); */
  background-color: rgba(255,255,255,0.9);
}

.content-div{
  height: calc(100% - 30px);
  -webkit-overflow-scrolling: touch;
  overflow: auto;
  position: relative;
}

.quotes-list{
  margin: 20px;
}

.floating-switcher{
  position: absolute;
  top: 10px;
  left: 10px;
}
</style>
