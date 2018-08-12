<template>
<div class="container">
  <div class="row">
    <div class="columns eight offset-by-two">
      <h1>
        Project Loader
      </h1>

      <h2>
        Sample Projects
      </h2>

      <div :key="sample.sampleID" v-for="sample in samples">
        Name: {{ sample.name }} <button @click="addProject({ projectJSON: sample.projectJSON, name: sample.name })">Copy from this template</button>
      </div>

      <h2>Load Project File</h2>
      <div>
        <button @click="openDialogue">Load</button>
        <input type="file" hidden @change="loadFile" ref="project-file-loader">
      </div>


      <h2>
        My Projects
      </h2>
      <h3 v-if="projects.length === 0 && !loading">
        You dont have any project yet.
        Please cooy from a template to get started.
      </h3>
      <h3 v-if="loading">Loading</h3>
      <ul>
        <li :key="project.id" v-for="project in projects">
          Name: <input type="text" v-model="project.name" @input="replaceToDB({ project })">
          <button @click="loadProject({ project })">Edit</button>
          <button @click="cloneProject({ project })">Clone Project</button>
          <button @click="downloadFile({ project })">Download File</button>
          <br />
          Last Updated: {{ new Date(project.dateUpdated).toDateString() }} - {{ new Date(project.dateUpdated).toTimeString() }}
          <br />
          Created At: {{ new Date(project.dateCreated).toDateString() }} - {{ new Date(project.dateCreated).toTimeString() }}

          <br />
          Delete: <button @click="deleteProject({ project })">Delete</button>
          <br />
        </li>
      </ul>
    </div>

  </div>
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
      loading: false,
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
  watch: {
  },
  methods: {
    openDialogue () {
      if (this.$refs['project-file-loader']) {
        this.$refs['project-file-loader'].click()
      }
    },
    downloadFile ({ project }) {
      var json = JSON.stringify(JSON.parse(project.projectJSON), null, '\t')
      var url = URL.createObjectURL(new Blob([json]), { type: 'application/json' })
      var anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `${project.name}@ Date Of @` + new Date() + '.json'
      anchor.target = '_blank'
      anchor.click()
    },
    async loadFile (evt) {
      var file = evt.target.files[0]
      var reader = new FileReader()
      reader.onload = () => {
        try {
          let result = reader.result
          let newFileName = file.name.replace(/\.json/, '')
          newFileName = newFileName.split('@ Date Of @')
          if (newFileName.length >= 2) {
            newFileName.pop()
          }
          newFileName = newFileName.join('')

          let project = {
            sampleID: makeID(),
            name: newFileName,
            projectJSON: result
          }
          this.addProject(project)
        } catch (e) {
          console.log('file reader error')
        }
      }
      if (file) {
        reader.readAsText(file)
      } else {
        console.log('file reader error')
      }
    },
    async deleteProject ({ project }) {
      if (window.prompt(`Type the title of this project to confirm delete: ${project.name}`) === project.name) {
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

      // update save method
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
    this.loading = true
    await this.syncLF()
    this.loading = false
    // debug
    // this.loadProject({ project: this.projects[0] })
  }
}
</script>

<style scoped>
.full{
  width: 100%;
}
</style>
