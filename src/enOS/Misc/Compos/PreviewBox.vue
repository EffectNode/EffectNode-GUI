<template>
  <iframe class="iframer" v-if="enabled" :src="link" frameborder="0"></iframe>
</template>

<script>
import * as API from '@/enOS/data/API'
import * as Builder from '@/enOS/data/builder'
import { HiveData } from '@/enOS/data/services'

export default {
  props: {
    enabled: {
      default: false
    },
    project: {}
  },
  data () {
    return {
      html: '',
      link: false
    }
  },
  mounted () {
    this.getPreviewOfProject({ project: this.project })
  },
  methods: {
    async getPreviewOfProject ({ project }) {
      API.StartLoading()
      return new Promise((resolve) => {
        API.RT.en.emit('preview-project', { projectID: project._id }, async ({ signal = 'bad', connections, boxes }) => {
          let Doc = HiveData.makeDocumentStack()
          Doc.root.modules = boxes.filter(b => b.name.toLowerCase().indexOf('video encoder') === -1)
          Doc.root.connectors = connections

          let html = await Builder.fromDocToHTMLProd({ Doc })
          this.html = html
          this.link = Builder.makeHTMLLink({ HTML: html })

          this.$forceUpdate()
          resolve(html)
          API.EndLoading()
        })
      })
    }
  }
}
</script>

<style scoped>
.iframer{
  margin: 0px;
  padding: 0px;
  width: 100%;
  height: 100%;
}
</style>
