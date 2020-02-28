const gulp = require('gulp');
const gulp_pug = require('gulp-pug');
const gulp_sass = require('gulp-sass');
const gulp_gm = require('gulp-gm');
const gulp_babel = require('gulp-babel');
const autoprefixer = require('gulp-autoprefixer');

const browserSync = require('browser-sync');

function swallowError(error) {
	console.log(error.toString());
	this.emit('end');
} 

function swallowErrorBeQuiet() {
	this.emit('end');
}

function process_babel(arg1, arg2) {
	var callback = false;

	var fname;
	if(arg1 instanceof Function && arg1.name == 'done') {
		fname = 'src/js/**/*.{js,es6}';
		callback = true;
	}
	else {
		fname = arg2;
	}

	console.log('Processing \"' + fname + '\"...');

	gulp.src(fname, {"base": "src/js"})
		.pipe(gulp_babel({
			presets: ['@babel/env']
        }))
		.on('error', swallowError)
		.pipe(gulp.dest('build/js'));

	if(callback)
		arg1();
}

function process_pug(cb) {
	gulp.src([
		'src/main.pug',
		'src/education.pug',
		'src/influencer.pug',
		'src/TryDemo.pug'
	])
		.pipe(gulp_pug())
		.on('error', swallowError)
		.pipe(gulp.dest('build'));
	cb();
}

function process_sass(cb) {
	gulp.src([ 
		'src/scss/main.scss'
	])
		.pipe(gulp_sass())
		.on('error', swallowError)
		.pipe(autoprefixer({
            cascade: true
        }))
		.pipe(gulp.dest('build/css'));
	cb();
}

function process_image(file, stats) {
	gulp.src(file, {"base": "src/images"})
		.pipe(gulp_gm(function(f) {
			console.log('Processing \"' + f.source + '\"...');
			f._subCommand = "magick";
			//console.log(f);
			return f.background("none").setFormat('webp');
		}, {
			imageMagick: true
		}))
		.on('error', swallowError)
		.pipe(gulp.dest('build/images'));
}

function process_all_images(cb) {
	process_image('src/images/*.{jpeg,jpg,gif,png,svg}');
	cb(); 
} 

function reload(cb) {  
	browserSync.reload();
	cb();
}

function serve(cb) { 
	browserSync.init({
		port: 8080,
		server: {
			baseDir: "./build",
			index: "main.html",
			port: 8080
		},
		ui: {
			port: 8081
		},
		//open: false
	}); 

	gulp.watch("src/**/*.scss", process_sass);
	gulp.watch("src/**/*.pug", process_pug);
	gulp.watch("src/**/*.{js,es6}").on("all", process_babel);
	gulp.watch("src/images/*.{jpeg,jpg,gif,png,svg}").on("add", process_image);

	gulp.watch([
		"build/css/main.css",
		"build/*.html",
		"build/js/main.js",
		"build/images/*.webp",
	], reload);

	cb(); 
} 

exports.default = gulp.parallel(process_pug, process_sass, process_babel, process_all_images);
exports.sass = process_sass;
exports.pug = process_pug;
exports.babel = process_babel;
exports.images = process_all_images;
exports.watch = serve;
