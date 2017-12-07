function parse () {
  const options = [...document.getElementById('P26_PROFS_LEFT').children]
  return options.map(o => {
    const m = o.innerText.match(/(.*?) \(.*?, (.*?)\)/)
    const names = m[1].split(' ')

    return {
      id: parseInt(o.getAttribute('value')),
      name: m[1],
      code: (names[names.length - 1][0] + names[0].slice(0, 2)).toUpperCase(),
      type: m[2]
    }
  })
}

JSON.stringify(parse())
