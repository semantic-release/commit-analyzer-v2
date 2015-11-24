const { test } = require('tap')

const analyzer = require('../../dist')

test('derive version number from commits', (t) => {
  t.test('no change', (tt) => {
    tt.plan(2)

    analyzer({}, {
      commits: [{
        hash: 'asdf',
        message: 'chore: build script'
      }]
    }, (err, type) => {
      tt.error(err)
      tt.is(type, null)
    })
  })

  t.test('patch version', (tt) => {
    tt.plan(2)

    analyzer({}, {
      commits: [{
        hash: 'asdf',
        message: 'fix: nasty bug'
      }, {
        hash: '1234',
        message: 'fix(scope): even nastier bug'
      }]
    }, (err, type) => {
      tt.error(err)
      tt.is(type, 'patch')
    })
  })

  t.test('minor/feature version', (tt) => {
    tt.plan(2)

    analyzer({}, {
      commits: [{
        hash: 'asdf',
        message: 'fix: nasty bug'
      }, {
        hash: '1234',
        message: 'feat(scope): cool feature'
      }]
    }, (err, type) => {
      tt.error(err)
      tt.is(type, 'minor')
    })
  })

  t.test('major/breaking version', (tt) => {
    tt.plan(2)

    analyzer({}, {
      commits: [{
        hash: 'qwer',
        message: 'feat(something): even cooler feature\nBREAKING CHANGE: everything so broken'
      }, {
        hash: '1234',
        message: 'feat(scope): cool feature'
      }, {
        hash: 'asdf',
        message: 'fix: nasty bug'
      }]
    }, (err, type) => {
      tt.error(err)
      tt.is(type, 'major')
    })
  })

  t.test('scope with / (#7)', (tt) => {
    tt.plan(2)

    analyzer({}, {
      commits: [{
        hash: '1234',
        message: 'feat(foo/bar): baz'
      }]
    }, (err, type) => {
      tt.error(err)
      tt.is(type, 'minor')
    })
  })

  t.end()
})
