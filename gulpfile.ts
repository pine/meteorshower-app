import * as fs from 'fs'

import * as gulp from 'gulp'
import * as plumber from 'gulp-plumber'
import * as mustache from 'gulp-mustache'
import * as rename from 'gulp-rename'

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
    // .pipe($.if(!isWatch, $.jsonminify()))
    .pipe(gulp.dest('./dist'))
)

gulp.task('manifest-watch', () => {
  gulp.watch('./src/manifest.json.mustache', ['manifest'])
})


// ----- for production -------------------------------------------------------

gulp.task('build-prod', cb => {
  runSequence(
    'clean',
    [
      'assets',
      'manifest',
      // 'webpack-prod',
    ],
    // 'zip',
    cb
  )
})

gulp.task('default', ['build-prod'])
