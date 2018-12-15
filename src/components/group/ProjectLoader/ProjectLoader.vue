<template>
<div class="container">
  <div class="row">
    <div class="columns six">
      <h1>
        Starter Templates
      </h1>
      <div class="templates-area">

        <div
          class="template-box"
          :key="sample.sampleID" v-for="sample in samples"
        >
          <div class="template-name">{{ sample.name }}</div>
          <div class="use-this" @click="addProject({ projectJSON: sample.projectJSON, name: sample.name })">+</div>
        </div>
      </div>

      <h1>Restore a Project</h1>
      <div>
        <span class="action-link" @click="openDialogue">Load Project Backup File</span>
        <input type="file" hidden @change="loadFile" ref="project-file-loader">
      </div>

    </div>
    <div class="columns six">
      <h1>
        My Local Projects
      </h1>
      <h3 v-if="projects.length === 0 && !loading">
        You dont have any project yet.
        Please cooy from a template to get started.
      </h3>
      <h3 v-if="loading">Loading</h3>
      <ol class="project-ordered-list">
        <li :key="project.id" v-for="project in projects">

          <ul>
            <li>
              Title: <input class="name-editor" type="text" v-model="project.name" @input="replaceToDB({ project })" />
            </li>
            <li>
              <span class="action-link" @click="loadProject({ project })">Edit this Project</span>
            </li>
            <li>
              <span class="action-link" @click="cloneProject({ project })">Clone this project</span>
            </li>
            <li>
              <span class="action-link" @click="downloadFile({ project })">Download Project Backup File</span>
            </li>
            <li>
              <span class="action-link" @click="deleteProject({ project })">Delete Project</span>
            </li>
            <li>
              Updated: {{ getFromNow(project.dateUpdated) }}
            </li>
            <li>
              Created: {{ getDateTime(project.dateCreated) }}
            </li>

          </ul>


        </li>
      </ol>

    </div>

  </div>
</div>
</template>

<script>
import * as ENdb from '@/components/parts/EffectNode/ENdb/ENdb.js'
import moment from 'moment'

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
          name: 'First Fun Stuff',
          projectJSON: JSON.stringify(require('@/components/parts/EffectNode/TimeMachine/samples/single-page.json'))
        },
        {
          sampleID: makeID(),
          name: 'SDK Tutorial',
          projectJSON: JSON.stringify(require('@/components/parts/EffectNode/TimeMachine/samples/tutorial.json'))
        }
      ],
      projects: []
    }
  },
  watch: {
  },
  methods: {
    getDateTime (d) {
      return moment(d).format('MMMM Do YYYY, h:mm:ss a')
    },
    getFromNow (d) {
      return moment(d).fromNow()
    },
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
.templates-area {
  display: flex;
  justify-content: flex-start;
  align-items: space-around;
}
.template-box {
  position: relative;
  border: black solid 1px;
  width: 150px;
  height: 150px;
  margin: 20px;
  margin-left: 0px;
}

.template-name {
  margin-top: 30px;
  text-align: center;
}
.use-this{
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  position: absolute;
  bottom: 10px;
  right: 10px;
  border: black solid 1px;
}

.use-this:hover{
  background-color: beige;
}
.action-link{
  cursor: pointer;
  text-decoration: underline;
}
.action-link:hover{
  font-weight: bold;
}
.name-editor{
  appearance: none;
  padding: 10px;
  border: black solid 1px;
  box-sizing: border-box;
  outline: none;
}
.project-ordered-list > li{
  margin-bottom: 35px;
}
</style>
