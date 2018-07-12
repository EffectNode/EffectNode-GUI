<template>
<div>
  <h1>
    Project Loader
  </h1>

  <h2>
    Sample Projects
  </h2>

  <div :key="sample.sampleID" v-for="sample in samples">
    Name: {{ sample.name }} <button @click="addProject({ projectJSON: sample.projectJSON, name: sample.name })">Copy from this template</button>
  </div>

  <h2>
    My Projects
  </h2>
  <h3 v-if="projects.length === 0">
    You dont have any project yet.
    Please cooy from a template to get started.
  </h3>
  <ul>
    <li :key="project.id" v-for="project in projects">
      Name: <input type="text" v-model="project.name" @input="replaceToDB({ project })">
      <button @click="loadProject({ project })">Edit this project</button>
      <button @click="cloneProject({ project })">Clone this project</button>

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
let lf = ENdb.lf

export default {
  data () {
    return {
      lf,
      samples: [
        {
          sampleID: Math.random() + '',
          name: 'Spacious',
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
        await lf.removeItem(project.id)
        await this.syncLF()
      }
    },
    async syncLF () {
      let arr = []
      await lf.iterate((value, key, iterationNumber) => {
        // Resulting key/value pair -- this callback
        // will be executed for every item in the
        // database.
        arr.push({
          id: key,
          ...value
        })
      })

      // let arr = await db.projects.toArray()
      this.projects = arr
      this.$forceUpdate()
    },
    async addProject ({ projectJSON, name }) {
      await lf.setItem(ENdb.makeID(), {
        projectJSON,
        name,
        dateUpdated: new Date(),
        dateCreated: new Date()
      })

      await this.syncLF()
    },
    async cloneProject ({ project }) {
      await lf.setItem(ENdb.makeID(), {
        projectJSON: project.projectJSON,
        name: project.name + ' (Cloned)',
        dateUpdated: new Date(),
        dateCreated: new Date()
      })

      await this.syncLF()
    },
    async replaceToDB ({ project }) {
      await lf.setItem(project.id, project)
    },
    async loadProject ({ project }) {
      if (!project) {
        return
      }
      this.$emit('load-root', JSON.parse(project.projectJSON))

      this.$emit('save-method', ({ projectJSON }) => {
        lf.setItem(project.id, { ...project, projectJSON, dateUpdated: new Date() })
      })

      this.$nextTick(() => {
        this.$emit('compile')
        this.$emit('change-mode', 'CodeEditor')
      })
    }
  },
  async mounted () {
    await this.syncLF()
    // debug
    // this.loadProject({ project: this.projects[0] })
  }
}
</script>

<style>

</style>
