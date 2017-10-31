import * as fs from 'fs'
import { exec } from 'child_process'

import * as gulp from 'gulp'
import * as gutil from 'gulp-util'
import * as plumber from 'gulp-plumber'
import * as mustache from 'gulp-mustache'
import * as rename from 'gulp-rename'
import * as _if from 'gulp-if'
import * as jsonminify from 'gulp-jsonminify'
import * as zip from 'gulp-zip'

import * as del from 'del'
import * as runSequence from 'run-sequence'
import * as _ from 'lodash'


// ---------------------------------------------------------------------------

interface PackageJSON {
  version: string;
}
const pkg: PackageJSON = JSON.parse(fs.readFileSync('./package.json').toString('utf-8'))
const isWatch = process.argv.indexOf('watch') > -1


// ----- assets ---------------------------------------------------------------

gulp.task('assets', () =>
  gulp.src('./assets/**/*')
    .pipe(gulp.dest('./dist'))
)

gulp.task('assets-watch', () =>
  gulp.watch('./assets/**/*', ['assets'])
)


// ----- clean ----------------------------------------------------------------

gulp.task('clean', cb => {
  del(['dist', '*.zip'])
    .then(() => cb())
    .catch(err => cb(err))
})


// ----- manifest -------------------------------------------------------------

gulp.task('manifest', () =>
  gulp.src('./src/manifest.json.mustache')
    .pipe(plumber())
    .pipe(mustache({
      version: pkg.version,
    }))
    .pipe(rename({ extname: '' }))
    .pipe(_if(!isWatch, jsonminify()))
    .pipe(gulp.dest('./dist'))
)

gulp.task('manifest-watch', () => {
  gulp.watch('./src/manifest.json.mustache', ['manifest'])
})


// ----- tslint ---------------------------------------------------------------

gulp.task('tslint', () =>
  gulp.src('src/**/*.ts')
    .pipe(plumber())
    // .pipe(tslint({ formatter: 'prose' }))
    // .pipe(tslint.report({ summarizeFailureOutput: true }))
)


// ----- webpack --------------------------------------------------------------

function runWebpack(opts: string[], cb: (arg: any) => any) {
  const defaults = [
    '--colors',
    '--display-chunks',
  ]
  if (!process.env.CI) {
    defaults.push('--progress')
  }
  opts = _.union(opts, defaults)

  const message = 'Run webpack with options `' + opts.join(' ') + '`'
  gutil.log(message)

  const cmd = 'webpack ' + opts.join(' ')
  const child = exec(cmd, cb)
  child.stdout.on('data', data => process.stdout.write(data))
  child.stderr.on('data', data => process.stderr.write(data))
}


gulp.task('webpack-prod', cb => {
  runWebpack([], cb)
})

gulp.task('webpack-watch', cb => {
  runWebpack(['--watch'], cb)
})


// ----- zip ------------------------------------------------------------------

gulp.task('zip', ['zip.archive', 'zip.source'])

gulp.task('zip.archive', () =>
  gulp.src('dist/**/*')
    .pipe(zip('archive.zip'))
    .pipe(gulp.dest('.'))
)

gulp.task('zip.source', () =>
  gulp.src([
    'assets/**/*',
    'src/**/*',
    'test/**/*',
    '.node-version',
    '.editorconfig',
    '.gitignore',
    '*.js',
    '*.json',
    '*.yml',
    '*.md',
    'yarn.lock',
    'LICENSE',
  ], { base: '.' })
    .pipe(zip('source.zip'))
    .pipe(gulp.dest('.'))
)


// ----- for production -------------------------------------------------------

gulp.task('build-prod', cb => {
  runSequence(
    'clean',
    [
      'assets',
      'manifest',
      'webpack-prod',
    ],
    'zip',
    cb
  )
})

gulp.task('default', ['build-prod'])


// ----- for development ------------------------------------------------------

gulp.task('build-watch', cb => {
  runSequence(
    [
      'assets',
      'manifest',
    ],
    cb
  )
})

gulp.task('watch', cb => {
  runSequence(
    'clean',
    [
      'build-watch',
    ],
    [
      'assets-watch',
      'manifest-watch',
      'webpack-watch',
    ],
    cb
  )
})



// vim: se et ts=2 sw=2 sts=2 ft=typescript :
