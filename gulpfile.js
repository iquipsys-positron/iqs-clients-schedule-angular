var gulp = require('gulp');

// Add standard tasks    
require('pip-webui-tasks').all(gulp);

// Define build tasks        
gulp.task('build', ['build-dev', 'build-prod']);
gulp.task('rebuild', ['build-dev']);
gulp.task('clean', ['build-clean']);
gulp.task('watch', ['build-watch']);
gulp.task('jshint', ['test-jshint']);
gulp.task('launch', ['app-launch']);
gulp.task('publish', ['app-publish-alpha']);

// Set default task
gulp.task('default', ['build']);