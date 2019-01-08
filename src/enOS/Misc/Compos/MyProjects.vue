<template>
  <div class="sys-constraint">
    <div class="left-right">
      <div>
        <div >
          <span class="title">
            <input type="text" placeholder="Search..." class="texter-search" v-model="search" @input="() => { viewFor = 'all' }" />
          </span>

          <span>
            <br />
            Filter:
            <span class="btn-next" :class="{ active: viewFor === 'all' }" @click="viewFor = 'all'">All</span>
            /
            <span class="btn-next" :class="{ active: viewFor === 'template' }" @click="viewFor = 'template'">My Templates</span>
            /
            <span class="btn-next" :class="{ active: viewFor === 'gallery' }" @click="viewFor = 'gallery'">At Gallery</span>
            /
            <span class="btn-next" :class="{ active: viewFor === 'featured' }" @click="viewFor = 'featured'">Featured</span>
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
        <span class="linker" @click="enterProject({ project: pr })">
          <WinWinSmall :project="pr" :enabled="activeAt[pi]" :ref="pr._id"></WinWinSmall>
        </span>
        <p>
          <input class="texter" type="text" v-model="pr.title" @input="prjUpdate({ project: pr })">
          <br />
          <textarea class="desc" cols="30" rows="10" v-model="pr.desc" @input="prjUpdate({ project: pr })"></textarea>
          <br />
          <span class="updated-at">{{ moment(pr.updatedAt) }}</span>
          <br />
          <span class="linker" @click="cloneProject({ project: pr })">Clone</span>
          <span v-if="!(pr.isTemplate || pr.isGallery || pr.isFeatured)" class="linker" @click="removeProject({ project: pr })">Remove</span>

          <br />
          <label :for="pr.id + '_template'">Template? <input :id="pr.id + '_template'" type="checkbox" class="yesno" v-model="pr.isTemplate" @change="prjUpdate({ project: pr })" /></label>
          <label :for="pr.id + '_gallery'">Gallery? <input :id="pr.id + '_gallery'" type="checkbox" class="yesno" v-model="pr.isGallery" @change="prjUpdate({ project: pr })" /></label>
          <label :for="pr.id + '_featured'">Be Featured? <input :id="pr.id + '_featured'" type="checkbox" class="yesno" v-model="pr.isFeatured" @change="prjUpdate({ project: pr })" /></label>
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
      viewFor: 'all', // template or all
      winWidth: window.innerWidth
    }
  },
  computed: {
    pageProject () {
      return this.projects.slice().filter((p) => {
        if (this.viewFor === 'all') {
          return true
        } else if (this.viewFor === 'template') {
          return p.isTemplate
        } else if (this.viewFor === 'gallery') {
          return p.isGallery
        } else if (this.viewFor === 'featured') {
          return p.isFeatured
        } else {
          return true
        }
      }).filter((p) => {
        if (!this.search) {
          return true
        }
        return p.title.toLowerCase().indexOf(this.search.toLowerCase()) !== -1 || p.desc.toLowerCase().indexOf(this.search.toLowerCase()) !== -1
      }).sort((a, b) => {
        let timeA = (new Date(b.updated_at)).getTime() || 1
        let timeB = (new Date(a.updated_at)).getTime() || 0
        if (timeA > timeB) {
          return 1
        } else if (timeA < timeB) {
          return -1
        } else {
          return 0
        }
      }).filter((p, pi) => {
        return pi < (this.atPage + 1) * this.perPageItem && pi >= (this.atPage) * this.perPageItem
      })
    }
  },
  watch: {
    viewFor () {
      this.search = ''
    },
    search () {
      this.activeAt.map(e => false)
      this.atPage = 0
    }
  },
  async mounted () {
    this.ts.project = new API.TableSync({ namespace: 'project', getArray: () => { return this.projects } })
    this.ts.project.sync()
    this.listProject()
  },
  methods: {
    moment (date) {
      return moment(date).fromNow()
    },
    listProject () {
      this.projects = []
      this.ts.project.hydrate({ userID: API.myself._id }).then((resp) => {
        // if there's no items then go to new project page
        if (resp.data && resp.data.results && resp.data.results.length === 0) {
          this.$emit('mode', 'newprojects')
        }
      })
      this.loopActivate()
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
        title: 'Project - ' + new Date(),
        desc: '',
        date: new Date()
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
  width: 150px;
  border: none;
  outline: none;
  appearance: none;
  border-bottom: black solid 1px;
  border-radius: 0px;
}
.btn-next{
  border: none;
  appearance: none;
  border-bottom: black solid 1px;
  padding-bottom: 1px;
  outline: none;
}
.btn-next.active{
  color: #31b593;
  border-bottom: #31b593 solid 1px;
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
