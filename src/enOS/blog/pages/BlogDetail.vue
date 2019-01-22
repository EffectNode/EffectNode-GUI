<template>
  <div class="padder">
    <h1><router-link class="linker" tag="span" to="/">Effect Node</router-link> / <router-link class="linker" tag="span" to="/blog">Blog</router-link></h1>
    <div v-if="blog" >
      <h1 class="title" v-if="blog">
        {{ blog.title }}
      </h1>
      <QuillEditor class="full" :toolbar="false" v-if="blog" :initText="blog.contents"></QuillEditor>
    </div>

  </div>
</template>

<script>
import * as API from '@/enOS/data/API'
import QuillEditor from '../elements/QuillEditor.vue'
export default {
  components: {
    QuillEditor
  },
  data () {
    return {
      blog: false
    }
  },
  computed: {
    slug () {
      return this.$route.params.slug
    }
  },
  mounted () {
    this.loadLatest()
  },
  methods: {
    loadLatest () {
      let exp = { userID: '5c1daecd6168c20017eec65e', slug: this.slug }
      API.RT.en.emit('list-latest-blogs', { exp, skip: 8 * this.page, limit: 1 }, (data) => {
        if (data.signal === 'ok') {
          this.blog = data.blogs[0]
        }
      })
    }
  }
}
</script>

<style scoped>
.full{
  width: 100%;
  height: 100%;
}
.padder {
  width: calc(100% - 15px * 2);
  margin: 0px auto;
}
@media screen and (min-width: 413px) {
  .padder {
    width: calc(100% - 15px * 2);
  }
}
@media screen and (min-width: 767px) {
  .padder {
    width: calc(700px);
  }
}
@media screen and (min-width: 959px) {
  .padder {
    width: calc(850px);
  }
}
@media screen and (min-width: 1440px) {
  .padder {
    width: calc(1200px);
  }
}
.linker{
  cursor: pointer;
  text-decoration: underline;
}
</style>
