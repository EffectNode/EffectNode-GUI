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
var makeID = () => {
  return '_' + Math.random().toString(36).substr(2, 9)
}

export default {
  data () {
    return {
      makeID,
      lf,
      samples: [
        {
          sampleID: makeID(),
          name: 'Spacious',
          projectJSON: JSON.stringify(require('@/components/parts/EffectNode/TimeMachine/samples/single-page.json'))
        },
        {
          sampleID: makeID(),
          name: 'Vue + Three.JS Tutorial',
          projectJSON: JSON.stringify(require('@/components/parts/EffectNode/TimeMachine/samples/tutorial.json'))
        }
      ],
      projects: []
    }
  },
  methods: {
    async deleteProject ({ project }) {
      if (window.confirm('delete project?') && window.confirm('confirm delete project?') && window.confirm('final confirm delete project?')) {
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
      this.projects = arr.sort((a, b) => {
        if (Date.parse(a.dateCreated || new Date()) === Date.parse(b.dateCreated || new Date())) {
          return 0
        } else if (Date.parse(a.dateCreated || new Date()) > Date.parse(b.dateCreated || new Date())) {
          return 1
        } else if (Date.parse(a.dateCreated || new Date()) < Date.parse(b.dateCreated || new Date())) {
          return -1
        }
      }).slice().reverse()
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
      let providedJSON = this.provideID({ projectJSON: project.projectJSON, forceNewID: true })

      project.projectJSON = providedJSON

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
    provideID ({ projectJSON, forceNewID = false }) {
      let root = JSON.parse(projectJSON)

      if (!root.rid || forceNewID) {
        root.rid = makeID()
      }

      return JSON.stringify(root)
    },
    async loadProject ({ project }) {
      if (!project) {
        return
      }

      let providedJSON = this.provideID({ projectJSON: project.projectJSON })
      lf.setItem(project.id, { ...project, projectJSON: providedJSON })

      this.$emit('load-root', JSON.parse(providedJSON))

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
