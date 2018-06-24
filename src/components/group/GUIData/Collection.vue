<template>
<div>
  <div class="gui-data-title">
    Create a Collection
  </div>

  <ul class="adder">
    <li class="gui-data-subtitle" :key="iNC" v-for="(nc, iNC) in newInfos">
      {{ nc.name }}
      <div class="data-desc">{{ nc.desc }}</div>
    </li>
  </ul>
  <div class="hr"></div>

  <div class="gui-data-title">
    Edit Your Collections
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      newInfos: [
        {
          name: 'Effect Nodes Storage',
          desc: 'Drag and Drop Effect Code Remixer'
        },
        {
          name: 'Shader Code Storage',
          desc: 'Custom Effect Code'
        },
        {
          name: '3D Layout Storage',
          desc: 'Helper for making 3D Layout'
        },
        {
          name: 'Article Storage',
          desc: 'Write Article in Markdown'
        },
        {
          name: 'Simple Data Storage',
          desc: 'a JSON Store'
        }
      ]
    }
  }
}
</script>

<style scoped>
.gui-data-title{
  font-family: 'InterUI-Bold', Arial, Helvetica, sans-serif;
  font-size: 40px;
  color: #939393;
  letter-spacing: 0;
}
.gui-data-subtitle{
  /* Effect Nodes: */
  font-family: 'InterUI-Regular', Arial, Helvetica, sans-serif;
  font-size: 30px;
  color: #505050;
  letter-spacing: 0;
}
.data-desc{
  font-family: 'InterUI-Regular', Arial, Helvetica, sans-serif;
  font-size: 12px;
  color: #505050;
  letter-spacing: 0;
}
.add-img{
  display: none;
}
.adder *{
  cursor: url('./img/plus-add.svg'), pointer;
}
.gui-data-subtitle,
.gui-data-subtitle .data.data-desc{
  transition: color 0.3s;
}
.gui-data-subtitle:hover{
  color: rgb(0, 204, 255);
}
.gui-data-subtitle:hover .data-desc{
  color: rgb(0, 204, 255);
  text-decoration: underline;
}

.hr{
  margin-top: 38px;
  margin-bottom: 38px;
  height: 3px;
  border-top: black solid 1px;
  border-bottom: black solid 1px;

  width: 100%;
  max-width: 650px;
}

</style>
