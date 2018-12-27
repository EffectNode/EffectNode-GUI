<template>
  <div>
    <div v-if="mode === 'gallery'">
      <h1>
        <span @click="showProjects()">My Projects</span>
        /
        <span @click="showGallery()">Gallery</span>
        /
        <span @click="showMyTemplates()">My Templates</span>
      </h1>
      <h2 @click="API.logout(); mode = 'login';">Logout</h2>
      <ul>
        <li :key="prj._id" v-for="prj in gallery.slice().reverse()">
          Title: <br />
          <textarea disabled type="text" v-model="prj.title" />
          <br />
          Desc: <br />
          <textarea disabled type="text" v-model="prj.desc" />
          <br />
          <button @click="cloneProject({ project: prj })">Clone Project</button>
        </li>
      </ul>
    </div>
    <div v-if="mode === 'templates'">
      <h1>
        <span @click="showProjects()">My Projects</span>
        /
        <span @click="showGallery()">Gallery</span>
        /
        <span @click="showMyTemplates()">My Templates</span>
      </h1>
      <h2 @click="API.logout(); mode = 'login';">Logout</h2>
      <ul>
        <li :key="prj._id" v-for="prj in templates.slice().reverse()">
          Title: <br />
          <textarea disabled type="text" v-model="prj.title" />
          <br />
          Desc: <br />
          <textarea disabled type="text" v-model="prj.desc" />
          <br />
          <button @click="cloneProject({ project: prj })">Clone Template</button>
        </li>
      </ul>
    </div>
    <div class="full word-lite" v-if="mode === 'projects'">
      <h1>
        <span @click="showProjects()">My Projects</span>
        /
        <span @click="showGallery()">Gallery</span>
        /
        <span @click="showMyTemplates()">My Templates</span>
      </h1>
      <h2 @click="API.logout(); mode = 'login';">Logout</h2>

      <!--  -->

      <button @click="createProject">Make one project</button>
      <h2 v-if="popagaiting === 'projects'">Loaidng Projects</h2>
      <ul>
        <li :key="prj._id" v-for="prj in projects.slice().reverse()">
          Title: <br />
          <textarea type="text" v-model="prj.title" @input="goUpdate({ project: prj })" />
          <br />
          Desc: <br />
          <textarea type="text" v-model="prj.desc" @input="goUpdate({ project: prj })" />
          <br />
          Set as my Template? <input type="checkbox" v-model="prj.isTemplate" @change="goUpdate({ project: prj })"  />
          <br />
          Share in Gallery? <input type="checkbox" v-model="prj.isGallery" @change="goUpdate({ project: prj })"  />

          <br />
          <button @click="loadProject({ project: prj })">Load Project</button>
          <button v-if="!(prj.isTemplate || prj.isGallery)" @click="removeProject({ project: prj })">Remove Project</button>
        </li>
      </ul>
    </div>
    <div class="full loading" v-if="mode === 'login'">
      <h2>Login........</h2>
      <input type="text" v-model="auth.username" />
      <input type="password" v-model="auth.password">
      <button @click="login">Login</button>
    </div>
    <div class="full loading" v-if="mode === 'loading'">
      <h2>Loading...</h2>
    </div>
  </div>
</template>

<script>
import * as API from '@/enOS/data/API'

export default {
  data () {
    return {
      popagaiting: false,
      mode: 'loading',
      API,
      ts: {},
      auth: {
        username: '',
        password: ''
      },
      projects: [],
      gallery: [],
      templates: []
    }
  },
  async mounted () {
    this.ts.project = new API.TableSync({ namespace: 'project', getArray: () => { return this.projects } })
    this.ts.gallery = new API.TableSync({ namespace: 'gallery', getArray: () => { return this.gallery } })
    this.ts.templates = new API.TableSync({ namespace: 'templates', getArray: () => { return this.templates } })
    await this.reload()
  },
  methods: {
    loadProject ({ project }) {
      window.location.assign(`/enOS/${project._id}`)
      // this.$router.push(`/enOS/${project._id}`)
    },
    quickOpen ({ project }) {
      this.$router.push(`/enOS/${project._id}`)
    },
    cloneProject ({ project }) {
      API.RT.en.emit('clone-project', { projectID: project._id, userID: API.myself._id }, (resp) => {
        console.log(resp)
        if (resp.signal === 'ok') {
          this.loadProject({ project: resp.newProject })
        } else {
          alert('cannot clone project')
        }
      })
    },
    async reload () {
      if (await API.checkLogin()) {
        this.ts.templates.sync()
        this.ts.gallery.sync()
        this.ts.project.sync()

        this.showProjects()
      } else {
        this.showLogin()
      }
    },
    goUpdate ({ project }) {
      this.ts.project.update(project)
    },
    showLogin () {
      this.mode = 'login'
      this.auth = {
        username: '',
        password: ''
      }
    },
    showProjects () {
      this.mode = 'projects'
      this.projects = []
      this.ts.project.hydrate({ userID: API.myself._id })
    },
    showGallery () {
      this.mode = 'gallery'
      this.gallery = []
      this.ts.gallery.hydrate({ isGallery: true })
    },
    showMyTemplates () {
      this.mode = 'templates'
      this.templates = []
      this.ts.templates.hydrate({ userID: API.myself._id, isTemplate: true })
    },
    async login () {
      await API.login(this.auth)
      if (this.$route.query && this.$route.query.redirect) {
        this.$router.push(this.$route.query.redirect)
      } else {
        this.reload()
      }
    },
    async removeProject ({ project }) {
      if (window.prompt('type in project desc to remove').trim().toLowerCase() === project.desc.trim().toLowerCase()) {
        this.ts.project.remove(project)
        window.alert('successfully removed')
      } else {
        window.alert('desc mistach, removal is canceled')
      }
    },
    async createProject () {
      this.ts.project.add({
        userID: API.myself._id,
        title: 'Project - ' + new Date(),
        desc: '',
        date: new Date()
      })
    }
  }
}
</script>

<style>

</style>
