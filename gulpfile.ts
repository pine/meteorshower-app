import * as fs from 'fs'

import * as gulp from 'gulp'
import * as plumber from 'gulp-plumber'
import * as mustache from 'gulp-mustache'
import * as rename from 'gulp-rename'
import * as _if from 'gulp-if'
import * as jsonminify from 'gulp-jsonminify'
import * as zip from 'gulp-zip'

import * as del from 'del'
import * as runSequence from 'run-sequence'


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
    .then(()=> cb())
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
      // 'webpack-prod',
    ],
    'zip',
    cb
  )
})

gulp.task('default', ['build-prod'])
