const fs = require('fs')
const json = JSON.parse(fs.readFileSync('courses_raw.json'))
const r = json.map(e => {
  const m = e.title.match(/(.*?) - (.*?) \\\\ (.*?) \\\\ ([^(\n]*)(?:\((.*)\))?/)
  const c = m[4].trim().split('-')
  if (m) {
    e.code = m[1]
    e.name = m[2].replace(/(&#xE9;)/g, 'é')
      .replace(/&#x27;/g, '\'')
      .replace(/&#xEA;/g, 'ê')
      .replace(/&#xE8;/g, 'è')
      .replace(/&#xF4;/g, 'ô')
      .replace(/&#xE0;/g, 'à')
    e.teacher = m[3]
    e.classFull = m[4].trim()
    e.classYear = c[0]
    e.classOrientation = c.length === 1 ? c[0] + m[3] : c[1]
    e.classType = c[2]
    e.room = m[5]
    e.day = new Date(e.start).getDay()
    delete e.title
    delete e.allDay
  }
  return e
})

console.log(r)
fs.writeFileSync('courses.json', JSON.stringify(r))
