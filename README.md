# HEG Horaire

A small PWA Vue.js project, to display a typcial week schedule for HEG school.
- Fast search lookup through unified search box (teachers, classes, rooms)
- Offline cached mode


## Config

teachers.json
```json
[{"id": 1,"name":"Last First","code":"FLA","type":"Custom type info"}, ...]
```

courses.json
```json
[{
    "className":"apex-cal-bluesky",
    "start":"2018-03-13T13:30:00",
    "end":"2018-03-13T16:00:00",
    "code":"732-2",
    "name":"",
    "teacher":"FLA",
    "classFull":"1-BL-TPart",
    "classYear":"1",
    "classOrientation":"BL",
    "classType":"TPart",
    "room":"325",
    "day":2
},...]
```

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
