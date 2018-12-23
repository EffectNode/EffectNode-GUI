<template>
  <div>
    <div class="full word-lite" v-if="mode === 'projects'">
      <h2>Projects</h2>
      <h2 @click="API.logout(); mode = 'login';">Logout</h2>
      <button @click="createProject">Make one project</button>
      <h2 v-if="popagaiting === 'projects'">Loaidng Projects</h2>
      <ul>
        <li :key="prj._id" v-for="prj in projects">
          {{ prj.title }}
          <br />
          <textarea type="text" v-model="prj.desc" @input="goUpdate({ project: prj })" />
          <br />
          <button @click="$router.push(`/enOS/${prj._id}`)">Load Project</button>
          <button @click="removeProject({ project: prj })">Remove Project</button>
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
      projects: []
    }
  },
  async mounted () {
    this.ts.project = new API.TableSync({ namespace: 'project', getArray: () => { return this.projects } })
    await this.reload()
  },
  methods: {
    async reload () {
      if (await API.checkLogin()) {
        this.showProjects()
      } else {
        this.showLogin()
      }
    },
    goUpdate ({ project }) {
      this.ts.project.update({ data: project })
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
      this.ts.project.sync()
      this.ts.project.hydrate({ userID: API.myself._id })
    },
    async login () {
      await API.login(this.auth)
      this.reload()
    },
    async removeProject ({ project }) {
      this.ts.project.remove({ data: project })
    },
    async createProject () {
      this.ts.project.add({
        data: {
          userID: API.myself._id,
          title: 'Project - ' + new Date(),
          desc: '',
          date: new Date()
        }
      })
    }
  }
}
</script>

<style>

</style>
