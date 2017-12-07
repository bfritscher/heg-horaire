<template>
  <div class="horaire">
    <nav class="print-only">
      {{query.map(e=>e.label).join(', ')}}
    </nav>
    <nav class="print-hide">
      <v-select style="flex: 1" placeholder="Filtre" multiple :value.sync="query" :createOption="createOption" :options="suggestOptions" :taggable="false" :searchable="true" :closeOnSelect="true"></v-select>
        <input type="checkbox" @click.prevent="setFav()" :checked="JSON.stringify(fav) === JSON.stringify(query)" id="fav" class="css-checkbox"/><label for="fav" class="css-label" title="Marquer comme filtre préféré"></label>
    </nav>
    <section id="grid" class="dragscroll">
    <float-thead-table :top="0" position="absolute" :scrollContainer="getContainer" :autoReflow="true">
      <thead>
        <tr>
          <th class="periode" colspan="2"><label class="print-hide" v-if="query.length < 2">Classes<input type="checkbox" v-model="withClasses"></label></th>
          <th v-for="(v, d) in {1: 'Lundi', 2: 'Mardi', 3: 'Mercredi', 4: 'Jeudi', 5: 'Vendredi'}">{{v}}
            <div v-if="withClasses && query.length < 2" class="p" :style="{'grid-auto-columns': (100.0 / (daysClasses[d].length)) + '%'}">
              <div v-for="(e, i) in daysClasses[d]" :style="{'grid-column': `${i+1} / ${i+1}` }">
                {{e}}
              </div>
            </div>
            <div v-if="query.length > 1" class="p" :style="{'grid-auto-columns': (100.0 / (query.length)) + '%'}">
              <div v-for="(e, i) in query" :style="{'grid-column': `${i+1} / ${i+1}` }">
                {{e.label}}
              </div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(p, i) in this.periodes">
          <td class="periode">{{i + 1}}</th>
          <td class="periode">{{p}} -&nbsp;{{p | plus(45)}}</th>
          <td v-for="d in [1, 2, 3, 4, 5]" class="day">
            <div v-if="daysClasses[d]" class="p" :style="{'grid-auto-columns': query.length > 1 ? ((100.0 / (query.length)) + '%') : withClasses ? ((100.0 / (daysClasses[d].length)) + '%') : 'auto'}">
              <div v-for="e in days[`${d}_${p}`]" :style="{'grid-column': query.length > 1 ? getColumnFor(e) : withClasses ? `${daysClasses[d].indexOf(e.classFull)+1} / ${daysClasses[d].indexOf(e.classFull)+1}` : '1 / 1'}" :class="{first: e.first === i, last: e.last === i, [e.className]: 1}">
                <h2 v-if="e.first === i">{{e.name}}</h2>
                <p v-if="e.first === i">{{e.teacher}} <span v-if="e.room">({{e.room}})</span></p>
                <p v-if="e.first === i">{{e.classFull}}</p>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </float-thead-table>
    </section>
  </div>
</template>

<script>
import Vue from 'vue'
import 'dragscroll'
import vSelect from 'vue-select'
import FloatThead from 'vue-floatthead'
Vue.use(FloatThead)

const FAV_KEY = 'heg-horaire-fav'

function timeToMin (time) {
  if (!time) {
    return '00:00'
  }
  const h = time.split(':')
  return parseInt(h[0]) * 60 + parseInt(h[1])
}

function addIfNew (list, value, label, type) {
  if (value && !list.some(e => e.value === value.toLowerCase())) {
    list.push({label: label || value, value: value.toLowerCase(), type})
  }
}

export default {
  name: 'horaire',
  data () {
    return {
      JSON,
      query: [],
      withClasses: false,
      courses: [],
      teachers: [],
      fav: null,
      periodes: ['07:45', '08:30', '09:15', '10:15', '11:00', '11:45', '12:45', '13:30', '14:30', '15:15', '16:15', '17:00', '18:00', '18:45', '19:45', '20:30', '21:15']
    }
  },
  mounted () {
    this.fav = JSON.parse(localStorage.getItem(FAV_KEY) || '[]')
    this.query = this.fav.slice(0)
    fetch('static/courses.json').then(r => r.json()).then(r => {
      this.courses = r.map(e => {
        e.fullText = Object.values(e).join(' ').toLowerCase()
        return e
      }).sort((a, b) => {
        let candA = a.classOrientation
        let candB = b.classOrientation
        if (!candA || !candB) {
          candA = a.classType
          candB = b.classType
        }
        if (!candA || !candB) {
          candA = a.classYear
          candB = b.classYear
        }
        if (candB === candA) {
          const diff = a.classYear - b.classYear
          if (diff === 0) {
            return b.classType.localeCompare(a.classType)
          }
          return diff
        }
        return candB.localeCompare(candA)
      })
    })
    fetch('static/teachers.json').then(r => r.json()).then(r => {
      this.teachers = r
    })
  },
  computed: {
    filteredCourses () {
      if (this.query.length === 1 && this.query[0].value === 'tout') {
        this.withClasses = true
        return this.courses
      }
      return this.courses.filter(e => {
        return this.query.some(t => e.fullText.includes(t.value.toLowerCase().trim()))
      })
    },
    days () {
      return this.filteredCourses.reduce((days, e) => {
        let i = this.periodes.indexOf(e.start.substr(11, 5))
        let first = true
        while (timeToMin(this.periodes[i]) < timeToMin(e.end.substr(11, 5))) {
          const key = `${e.day}_${this.periodes[i]}`
          if (!days.hasOwnProperty(key)) {
            days[key] = []
          }
          if (first) {
            e.first = i
            first = false
          }
          days[key].push(e)
          i++
        }
        e.last = i - 1
        return days
      }, {})
    },
    daysClasses () {
      const dayClasses = this.filteredCourses.reduce((daysClasses, e) => {
        const day = e.day || 0
        if (!daysClasses.hasOwnProperty(day)) {
          daysClasses[day] = []
        }
        if (!daysClasses[day].includes(e.classFull)) {
          daysClasses[day].push(e.classFull)
        }
        return daysClasses
      }, {
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: []
      })
      Object.values(dayClasses).forEach(l => {
        if (l.length === 0) {
          l.push('-')
        }
      })
      return dayClasses
    },
    suggestOptions () {
      return this.courses.reduce((options, e) => {
        addIfNew(options, e.name)
        addIfNew(options, e.room, `Salle ${e.room}`, 'room')
        addIfNew(options, e.teacher, this.findTeacher(e.teacher), 'teacher')
        addIfNew(options, e.classFull, e.classFull, 'classFull')
        return options
      }, [{
        label: 'Tout',
        value: 'tout'
      }]).sort((a, b) => {
        return a.value.localeCompare(b.value)
      })
    }
  },
  methods: {
    createOption (value) {
      let f = this.suggestOptions.find(e => e.value === value)
      if (!f) {
        f = {
          label: value, value
        }
      }
      return f
    },
    findTeacher (code) {
      const f = this.teachers.find(t => t.code === code)
      return f ? `${f.name} (${code}) [${f.type}]` : code
    },
    getColumnFor (e) {
      const r = this.query.find((q) => e[q.type].toLowerCase() === q.value)
      const p = this.query.indexOf(r) + 1
      return `${p} / ${p}`
    },
    setFav () {
      this.fav = this.query.slice(0)
      localStorage.setItem(FAV_KEY, JSON.stringify(this.fav))
    },
    getContainer (table) {
      return table.parent()
    }
  },
  filters: {
    plus (val, min) {
      const newH = timeToMin(val) + min
      const newMin = newH % 60
      const newHFormat = '00' + ((newH - newMin) / 60)
      const newMinFormat = '00' + newMin
      return newHFormat.substr(newHFormat.length - 2) + ':' + newMinFormat.substr(newMinFormat.length - 2)
    }
  },
  components: {
    vSelect,
    FloatThead
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.horaire {
  display: flex;
  flex-direction: column;
  height: calc(100% - 28px);
}
.floatThead-wrapper {
  flex : 1;
  overflow: auto;
}
nav {
  margin: 8px;
  z-index: 1002;
}
#grid {
  padding: 8px;
  width: 100%;
  overflow: auto;
  height: 100%;
}
table {
  border-collapse: collapse;
  width: 100%;
}
thead tr th {
  background-color: white;
  border-bottom: 1px solid #333;
  border-right: 1px solid #333;
}
td {
  border: 1px solid #333;
  padding: 0;
  height: 50px;
}

td.day {
  min-width: calc(100vw / 6);
}

.p > div h2 {
  font-size: 10pt;
  font-weight: bold;
  margin: 4px;
}

p {
  margin :0;
}

.p {
  display: grid;
  height: 100%;
}

.p > div {
  grid-row: 1;
  font-size: 8pt;
  text-align: center;
  margin: 0 2px;
}

tbody .p > div {
  margin-bottom: -1px;
  margin-top: -1px;
  box-shadow: 2px 2px 1px 1px rgba(197, 197, 197, 0.62);
  word-wrap: break-word;
}

.p > div.first {
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  margin-top: 6px;
  margin-bottom: -1px;
}

.p > div.last {
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  margin-bottom: 6px;
  margin-top: -1px;
}
.p > div.apex-cal-bluesky {
  background-color: #6BB9F0;
}
.p > div.apex-cal-red {
  background-color: #D91E18;
}
.p > div.apex-cal-yellow {
  background-color: #F1C40F;
}
.p > div.apex-cal-green {
  background-color: #2ECC71;
}

.periode {
  font-size: 60%;
  padding: 2px;
}

nav {
  display: flex;
}

input[type="checkbox"].css-checkbox {
  position: absolute;
  z-index: -1000;
  left: -1000px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  height: 1px;
  width: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
}

input[type="checkbox"].css-checkbox + label.css-label {
  padding-left: 36px;
  height: 36px;
  display: inline-block;
  background-repeat: no-repeat;
  background-position: 0 0;
  vertical-align: middle;
  cursor: pointer;
  background-size: contain;
  background-image: url('../assets/ic_favorite_border_48px.svg');
}

input[type="checkbox"].css-checkbox:checked + label.css-label {
  background-image: url('../assets/ic_favorite_48px.svg');
}

.print-only {
  display: none;
}

@media print {
  .print-hide {
    display: none;
  }
  .print-only {
    display: initial;
  }
  nav {
    position: absolute;
    top: 0;
    right: 0;
    width: 50%;
  }
  #grid {
    page-break-inside: avoid;
  }
}
</style>
