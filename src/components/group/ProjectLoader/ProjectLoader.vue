<template>
<div>
  <h1>
    Project Loader
  </h1>

  <h2>
    Sample Projects
  </h2>

  <div :key="sample.sampleID" v-for="sample in samples">
    Name: {{ sample.name }} <button @click="addProject(sample)">Make</button>
  </div>

  <h2>
    My Projects
  </h2>

  <ul>
    <li :key="project.id" v-for="project in projects">
      Name: <input type="text" v-model="project.name" @input="saveToDB({ project })">
      <button @click="loadProject({ project })">Load</button>
      <button @click="cloneProject({ project })">Clone this</button>

      <br />
      Last Updated: {{ new Date(project.dateUpdated).toDateString() }} - {{ new Date(project.dateUpdated).toTimeString() }}
      <br />
      Created At: {{ new Date(project.dateCreated).toDateString() }} - {{ new Date(project.dateCreated).toTimeString() }}

      <br />
      Delete: <button @click="deleteProject({ project })">Delete</button>
      <br />
    </li>
  </ul>

  <br />
  <!-- <pre>{{ projects }}</pre> -->
</div>
</template>

<script>
import * as ENdb from '@/components/parts/EffectNode/ENdb/ENdb.js'
let db = ENdb.dx

export default {
  data () {
    return {
      samples: [
        {
          sampleID: Math.random() + '',
          name: 'PALMS',
          projectJSON: JSON.stringify(require('@/components/parts/EffectNode/TimeMachine/samples/single-page.json'))
        }
      ],
      projects: []
    }
  },
  methods: {
    async deleteProject ({ project }) {
      let confirm1 = window.confirm('delete project?')
      let confirm2 = window.confirm('confirm delete project?')
      let confirm3 = window.confirm('final confirm delete project?')

      if (confirm1 && confirm2 && confirm3) {
        await db.projects.delete(project.id)
        this.refreshDexi()
      }
    },
    async refreshDexi () {
      let arr = await db.projects.toArray()
      this.projects = arr
    },
    async addProject ({ projectJSON, name }) {
      await db.projects.put({
        projectJSON,
        name,
        dateUpdated: new Date(),
        dateCreated: new Date()
      })
      this.refreshDexi()
    },
    async cloneProject ({ project }) {
      await db.projects.put({
        projectJSON: project.projectJSON,
        name: project.name + ' (Cloned)',
        dateUpdated: new Date(),
        dateCreated: new Date()
      })
      this.refreshDexi()
    },
    async saveToDB ({ project }) {
      await db.projects.update(project.id, project)
    },
    loadProject ({ project }) {
      this.$emit('load-root', JSON.parse(project.projectJSON))

      this.$emit('save-method', ({ projectJSON }) => {
        db.projects.update(project.id, { projectJSON, dateUpdated: new Date() })
      })

      this.$nextTick(() => {
        this.$emit('compile')
        this.$emit('change-mode', 'CodeEditor')
      })
    }
  },
  mounted () {
    this.refreshDexi()
  }
}
</script>

<style>

</style>
