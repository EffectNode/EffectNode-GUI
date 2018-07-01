<template>
<div v-if="root">
  <div class="title add-cursor" @click="showInput = !showInput">
    Create a Collection <img src="./img/circle-add.svg" class="add-icon add-cursor" alt="">
  </div>

   <ul v-if="showInput">
    <li class="font">
      ID:
      <br />
      <input type="text" class="name" v-model="newCID">
      <br />
      <span class="is-taken" v-if="checkDuplicated({ cID: newCID })">This ID is taken.</span>
      <br />
    </li>

    <li class="font">
      Description:
      <br />
      <textarea class="desc" rows="6" v-model="newDesc"></textarea>
      <br />
      <button @click="addNewCollection">submit</button>
    </li>
  </ul>
  <!-- <pre>{{ root }}</pre> -->
</div>
</template>

<script>
import * as Hot from './HotData.js'
export default {
  props: {
    root: {
    }
  },
  components: {
  },
  data () {
    return {
      showInput: false,
      newDesc: '',
      newCID: ''
    }
  },
  methods: {
    checkDuplicated ({ cID }) {
      return !!Hot.getCollectionById({ root: this.root, cID })
    },
    addNewCollection () {
      if (this.checkDuplicated({ cID: this.newCID })) {
        window.alert('id is taken')
        return
      }
      if (!this.newCID) {
        window.alert('require ID')
        return
      }
      if (!this.newDesc) {
        window.alert('require description')
        return
      }
      var newCollection = Hot.createCollection({ cID: this.newCID, desc: this.newDesc })
      Hot.addCollection({ root: this.root, collection: newCollection })
      this.$emit('send')
      this.showInput = false
      this.newCID = ''
      this.newDesc = ''
    }
  }
}
</script>

<style scoped>
@import url(./Shared.css);

.add-cursor{
  cursor: url('./img/plus-arrow.svg'), pointer;
}

.add-icon{
  transition: all 0.5s;
}
.add-icon:hover,
.add-icon.close-icon{
  transform: rotate(405deg);
}


.name{
  width: 300px;
  padding:5px;
  border: 0px solid #ccc;
  border-bottom: 1px solid #bababa;
  -webkit-border-radius: 0px;
  border-radius: 0px;
  font-size: 18px;

}
.name:focus{
  outline: none;
}

.desc{
  width: 300px;
  height: 50px;

  padding:5px;
  border: 1px solid #bababa;
  /* border-bottom: 1px solid #bababa; */
  -webkit-border-radius: 0px;
  border-radius: 0px;
  font-size: 18px;

}
.desc:focus{
  outline: none;
}

.font{
  font-size: 20px;
  font-family: 'InterUI-Regular', Arial, Helvetica, sans-serif;
  letter-spacing: 0;
}

.is-taken{
  color: red;
}

</style>
