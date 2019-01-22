<template>
  <div class="area">
    <div class="padder">
      <div class="title">
        Effect Node Blog
        <span v-if="isMe && !workingDoc" class="adder linker" @click="addBlog">Add</span>
        <span v-if="isMe && workingDoc && uploadTimer === 0" class="adder linker" @click="workingDoc = false; view = 'list'">Close</span>
        <span v-if="isMe && workingDoc" class="adder linker" @click="removeDoc(workingDoc)">Remove</span>
        <span v-if="uploadTimer !== 0" class="loading">
          Loading....
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
      <div class="content" v-if="view === 'list'">
        <div>
          <div :key="blog._id" v-for="blog in blogs">
            <router-link class="subtitle" :to="`/blog/${blog.slug}`">
              {{ blog.title }} <br />
            </router-link>
            <span>  Created:
              {{ moment(blog.created_at) }}
            </span>

            <span class="linker" v-if="isMe" @click="editBlog(blog)">Edit</span>
            <span class="linker" v-if="isMe" @click="removeDoc(blog)">Remove</span>
            <input class="published-edit" type="checkbox" v-model="blog.published" @change="doUpload(blog)">
          </div>
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
      status: false,
      workingDoc: false,
      isMe: false,
      view: 'list',
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
    view () {
      if (this.view === 'list') {
        this.loadLatest()
      }
    }
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
          this.loadLatest()
        })
        this.view = 'list'
        this.workingDoc = false
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
      if (!this.isMe) {
        exp.published = true
      }
      API.RT.en.emit('list-latest-blogs', { exp, skip: 8 * this.page, limit: 50 }, (data) => {
        if (data.signal === 'ok') {
          console.log(data)
          this.blogs = data.blogs
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
  background-color: rgba(0,0,0,0.2);
}
.title{
  font-size: 40px;
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
