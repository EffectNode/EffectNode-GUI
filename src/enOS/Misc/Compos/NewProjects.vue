<template>
  <div class="sys-constraint">
    <div class="left-right">
      <div>
        <div>
          <span class="title">
            <input type="text" placeholder="Search Gallery..." class="texter-search" v-model="search">
          </span>
          <span>
            <br />
            Create: <span class="btn-next" @click="createProject">Empty Project</span>
            or...
            Clone from below
          </span>
        </div>
      </div>
      <div>
        <div class="pre-next">
          <span class="btn-next" v-if="atPage >= 0 && projects.length / ((atPage + 1) * perPageItem) > 1" @click="atPage += 1;">next</span>
          <span class="btn-prev" v-if="atPage >= 1" @click="atPage -= 1">back</span>
        </div>
      </div>
    </div>
    <br />
    <div class="my-projects">
      <!-- not so legit but kinda works -->
      <div :key="pr._id" v-for="(pr, pi) in pageProject" class="box">
        <span class="linker" @click="cloneProject({ project: pr })">
          <WinWinSmall :project="pr" :enabled="activeAt[pi]" :ref="pr._id"></WinWinSmall>
        </span>
        <p>
          <input disabled class="texter" type="text" v-model="pr.title" @input="prjUpdate({ project: pr })">
          <br />
          <textarea disabled class="desc" cols="30" rows="10" v-model="pr.desc" @input="prjUpdate({ project: pr })"></textarea>
          <span v-if="pr.author">
            <br />
            Author: {{ pr.author }}
          </span>
          <br />
          <span class="updated-at">{{ moment(pr.updatedAt) }}</span>
          <br />
          <span class="linker" @click="cloneProject({ project: pr })">Clone</span>
          <!-- <span v-if="!(pr.isTemplate || pr.isGallery || pr.isFeatured)" class="linker" @click="removeProject({ project: pr })">Remove</span> -->

          <!-- <br />
          <label :for="pr.id + '_template'">isTemplate? <input :id="pr.id + '_template'" type="checkbox" class="yesno" v-model="pr.isTemplate" @change="prjUpdate({ project: pr })" /></label>
          <label :for="pr.id + '_gallery'">isGallery? <input :id="pr.id + '_gallery'" type="checkbox" class="yesno" v-model="pr.isGallery" @change="prjUpdate({ project: pr })" /></label>
          <label :for="pr.id + '_featured'">isFeatured? <input :id="pr.id + '_featured'" type="checkbox" class="yesno" v-model="pr.isFeatured" @change="prjUpdate({ project: pr })" /></label> -->
        </p>
      </div>
      <!-- not so legit but kinda works -->
    </div>
    <div class="left-right">
      <div>

      </div>
      <div>
        <div class="pre-next">
          <span class="btn-next" v-if="atPage >= 0 && projects.length / ((atPage + 1) * perPageItem) > 1" @click="atPage += 1;">next</span>
          <span class="btn-prev" v-if="atPage >= 1" @click="atPage -= 1">back</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as API from '@/enOS/data/API'
import WinWinSmall from './WinWinSmall.vue'
import moment from 'moment'
export default {
  components: {
    WinWinSmall
  },
  data () {
    return {
      activeAt: [false, false, false, false, false, false],
      perPageItem: 6,
      atPage: 0,
      ts: {},
      API,
      search: '',
      projects: [],
      winWidth: window.innerWidth
    }
  },
  computed: {
    pageProject () {
      return this.projects.slice().sort((a, b) => {
        let timeA = (new Date(b.updated_at)).getTime() || 1
        let timeB = (new Date(a.updated_at)).getTime() || 0
        if (timeA > timeB) {
          return 1
        } else if (timeA < timeB) {
          return -1
        } else {
          return 0
        }
      }).sort((a, b) => {
        let valA = a.isFeatured ? 1 : -1
        let valB = b.isFeatured ? 1 : -1
        if (valA > valB) {
          return -1
        } else if (valA < valB) {
          return 1
        } else {
          return 0
        }
      }).filter((p) => {
        if (!this.search) {
          return true
        }
        return p.title.toLowerCase().indexOf(this.search.toLowerCase()) !== -1 || p.desc.toLowerCase().indexOf(this.search.toLowerCase()) !== -1
      }).filter((p, pi) => {
        return pi < (this.atPage + 1) * this.perPageItem && pi >= (this.atPage) * this.perPageItem
      })
    }
  },
  watch: {
    search () {
      this.activeAt.map(e => false)
      this.atPage = 0
    }
  },
  async mounted () {
    this.ts.project = new API.TableSync({ namespace: 'project', getArray: () => { return [] } })
    this.ts.project.sync()
    this.listProject()
  },
  methods: {
    moment (date) {
      return moment(date).fromNow()
    },
    listProject () {
      this.projects = []
      API.RT.en.emit('list-latest-gallery', { search: this.search, skip: this.atPage * 100, limit: 100 }, (resp) => {
        if (resp.signal === 'ok') {
          this.projects = resp.projects
          this.loopActivate()
        }
      })
      // this.ts.project.hydrate({ isGallery: true })
    },
    enterProject ({ project }) {
      window.location.assign(`/enOS/${project._id}`)
      // this.$router.push(`/enOS/${project._id}`)
    },
    cloneProject ({ project }) {
      if (!window.confirm('clone?')) {
        return
      }
      API.RT.en.emit('clone-project', { projectID: project._id, userID: API.myself._id, author: API.myself.name }, (resp) => {
        console.log(resp)
        if (resp.signal === 'ok') {
          window.alert('successfully cloned')
          this.enterProject({ project: resp.newProject })
        } else {
          alert('cannot clone project')
        }
      })
    },
    loopActivate () {
      this.activeAt.map((item, idx) => {
        setTimeout(() => {
          this.activeAt[idx] = true
          this.$forceUpdate()
        }, idx * 800)
        return false
      })
    },
    async viewFull (project) {
      try {
        let compo = this.$refs[project._id][0]
        let html = compo.$refs.preview.html
        let win = window.open('about:blank')
        win.document.write(html)
      } catch (e) {
        console.log(e)
        console.log('cannot ref vue compos')
      }
    },
    prjUpdate ({ project }) {
      project.author = API.myself.name
      this.ts.project.update(project)
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
        author: this.API.myself.name,
        title: 'new Empty Project',
        desc: 'empty',
        date: new Date()
      }).then((v) => {
        this.enterProject({ project: v })
      })
    }
  }
}
</script>


<style scoped>
.box{
  display: inline-block;
}
.my-projects{
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  flex-wrap: wrap;
}

.linker{
  text-decoration: underline;
  cursor: pointer;
}
.desc{
  margin: 0px;
  width: 348px;
  height: 34px;
  resize: none;
  border: none;
  outline: none;
  appearance: none;
  border-left: black solid 1px;
  padding-left: 5px;
}
.texter{
  width: 348px;
  border: none;
  outline: none;
  appearance: none;
  border-left: black solid 1px;
  padding-left: 5px;
}
label{
  user-select: none;
}
.texter-search{
  width: 150;
  border: none;
  outline: none;
  appearance: none;
  border-bottom: black solid 1px;
}
.texter-search{
  width: 150;
  border: none;
  outline: none;
  appearance: none;
  border-bottom: black solid 1px;
}
.btn-next{
  border: none;
  appearance: none;
  border-bottom: black solid 1px;
  padding-bottom: 1px;
  outline: none;
}
.btn-prev{
  border: none;
  appearance: none;
  border-bottom: black solid 1px;
  outline: none;
  padding-bottom: 1px;
}
.left-right{
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.title{
  font-size: 24px;
  font-weight: bold;
  padding: 0px 0px 0px 0px;
}
.pre-next{
  margin-right: 15px;
}
.updated-at{
  text-align: right;
}
</style>
