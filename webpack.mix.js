let mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/assets/js/app.js', 'public/js')
    .sass('resources/assets/sass/app.scss', 'public/css')
    .styles([
        'public/css/bee3D.css',
        'public/css/fontawesome-all.min.css',
        'vendor/eternicode/bootstrap-datepicker/dist/css/bootstrap-datepicker3.min.css'
    ], 'public/css/all.css')
    .scripts([
        'public/js/classie.js',
        'public/js/parallax.custom.js',
        'public/js/bee3D.js',
        'vendor/eternicode/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js',
        'vendor/eternicode/bootstrap-datepicker/dist/locales/bootstrap-datepicker.nl.min.js'
    ], 'public/js/all.js');



// mix.styles(['public/css/bee3D.css', 'public/css/fontawesome-all.min.css'], 'public/css/all.css');
