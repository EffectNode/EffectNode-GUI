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

    await API.LoginStatus.check()
    if (API.LoginStatus.isLoggedIn) {
      this.sync({ data: { userID: API.LoginStatus.myID } })
    } else {
      this.mode = 'login'
      this.auth = {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    goUpdate ({ project }) {
      this.ts.project.update({ data: project })
    },
    async sync () {
      this.mode = 'projects'
      API.sync({ userID: API.LoginStatus.myID })
      this.ts.project.load({ data: { userID: API.LoginStatus.myID } })
    },
    async login () {
      await API.login(this.auth)
      this.sync({ data: { userID: API.LoginStatus.myID } })
      this.$forceUpdate()
    },
    async removeProject ({ project }) {
      this.ts.project.remove({ data: project })
    },
    async createProject () {
      this.ts.project.add({
        data: {
          userID: API.LoginStatus.myID,
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
