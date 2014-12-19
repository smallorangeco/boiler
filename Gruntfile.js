// Project configuration.
module.exports = function (grunt) {
    grunt.initConfig({
        //uglify
        uglify: {
            options: {
                sourceMap: false
            },
            admin: {
                files: {
                    //'client/dist/bundle.min.js': [
                        //'path.file1.js',
                        //'path.fil2.js',
                        //'path.file3.js'
                    //]
                }
            }
        },
        //cssmin
        cssmin: {
            admin: {
                files: {
                    //'client/dist/bundle.min.css': [
                        //'path.file1.js',
                        //'path.fil2.js',
                        //'path.file3.js'
                    //]
                }
            }
        }
    });

    //Load Plugins
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    //grunt tasks
    grunt.registerTask('makestatic', ['uglify', 'cssmin']);
};