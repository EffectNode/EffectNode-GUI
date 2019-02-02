<template>
  <div class="area">
    <div class="padder">
      <div class="title">
        <router-link tag="span" class="linker" to="/">Effect Node</router-link> / <span :class="{ linker: (isMe && workingDoc) }" @click="$router.push('/blog')">Inventor's Blog</span>  <span v-if="isMe && workingDoc"> / </span><span v-if="isMe && workingDoc">{{ workingDoc.title }}</span>

        <br />

        <!--
        <span v-if="isMe && !workingDoc" class="adder linker" @click="addBlog">Add</span> -->
        <span v-if="isMe && workingDoc" class="adder linker" @click="removeDoc(workingDoc)">Remove</span>
        <span v-if="uploadTimer !== 0" class="loading">
          Saving / Loading....
        </span>
        <span v-if="status === 'uploading'" class="loading">Uploading....</span>
      </div>
      <div class="editor" v-if="view === 'editor'">
        <div v-if="!workingDoc">Loading</div>
        <div v-else>
          <input class="title-edit" type="text" v-model="workingDoc.title" @input="uploadDoc(workingDoc, { slug: workingDoc.title })">
          <span class="subtitle">Publisehd:</span>
          <input class="published-edit" type="checkbox" v-model="workingDoc.published" @change="uploadDoc(workingDoc)">
          <QuillEditor class="maxer" v-if="workingDoc" @status="(v) => { status = v }" :initText="workingDoc.contents" @change="(v) => { uploadDoc(workingDoc, { contents: v.ops }) }"></QuillEditor>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as API from '@/enOS/data/API'
import PreviewBox from '../../Misc/Compos/PreviewBox.vue'
import QuillEditor from '../elements/QuillEditor.vue'
import moment from 'moment'

export default {
  components: {
    QuillEditor,
    PreviewBox
  },
  data () {
    return {
      blogID: this.$route.params.blogID,
      status: false,
      workingDoc: false,
      isMe: false,
      view: 'editor',
      blogs: [],
      page: 0,
      uploadTimer: 0
    }
  },
  async mounted () {
    this.isMe = await API.checkLogin()
    this.loadLatest()
  },
  watch: {
  },
  methods: {
    goBlog (blog) {
      this.$router.push('/blog/' + blog.slug)
    },
    moment (v) {
      return moment(v).fromNow()
    },
    removeDoc (doc) {
      if (window.confirm('remove blog?')) {
        API.RT.en.emit('remove-working-blog', doc, () => {
          // this.loadLatest()
        })
        this.$router.push('/blog')
      }
    },
    doUpload (workingDoc) {
      API.RT.en.emit('update-working-blog', workingDoc, (data) => {
        this.uploadTimer = 0
      })
    },
    uploadDoc (workingDoc, v) {
      if (v) {
        this.workingDoc = workingDoc = {
          ...workingDoc,
          ...v
        }
      }
      clearTimeout(this.uploadTimer)
      this.uploadTimer = setTimeout(() => {
        this.doUpload(workingDoc)
      }, 1300)
    },
    editBlog (v) {
      this.view = 'editor'
      this.workingDoc = v
    },
    async addBlog () {
      this.view = 'editor'
      let meResp = await API.getMe()
      let userID = meResp.data._id
      let author = meResp.data.name
      API.RT.en.emit('provide-working-blog', { userID, author, title: window.prompt('title?') || 'new blog' }, (data) => {
        if (data.signal === 'ok') {
          this.workingDoc = data.blog
          this.loadLatest()
        }
      })
    },
    loadLatest () {
      let exp = { userID: '5c1daecd6168c20017eec65e' }
      exp._id = this.blogID
      // if (!this.isMe) {
      //   exp.published = true
      // }

      API.RT.en.emit('list-latest-blogs', { exp, skip: 8 * this.page, limit: 50 }, (data) => {
        if (data.signal === 'ok') {
          console.log(data)
          this.workingDoc = data.blogs[0]
        }
      })
    }
  }
}
</script>

<style scoped>
.area{
  width: 100%;
  height: 100%;
  -webkit-overflow-scrolling: touch;
  overflow: auto;
}
.title{
  font-size: 30px;
  color: white;
}
.linker{
  text-decoration: underline;
}
.adder.linker{
  font-size: 24px;
}
.title-edit{
  appearance: none;
  outline: none;
  border: none;
  background: transparent;
  color: white;
  margin-bottom: 20px;
  font-size: 22px;
  border-bottom: white solid 1px;
}
.editor{
  font-size: 18px;
  color: black;
}
.content{
  font-size: 18px;
  color: white;
}
.loading{
  font-size: 15px;
}
.subtitle{
  color: white;
  font-size: 30px;
}
.maxer{
  height: calc(100vh - 250px);
}
</style>
