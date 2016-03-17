'use strict';

module.exports = function(grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Check for a new version
    var bump = grunt.option('bump') || '';
    var currentversion = require('./package.json').version;
    if (bump !== '') {
        var semversion = require('semver');
        currentversion = semversion.inc(currentversion, bump);
    }

    var serveStatic = require('serve-static');

    // Configurable paths for the application
    var appConfig = {
        app: require('./bower.json').appPath || 'src',
        dist: 'dist',
        version: currentversion,
        module: require('./package.json').name,
        domain: 'tink.gis'
    };

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        yeoman: appConfig,
        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['wiredep']
            },
            js: {
                files: ['<%= yeoman.app %>/scripts/**/*.js'],
                tasks: ['newer:jshint:all'],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            },
            jsTest: {
                files: ['test/spec/{,*/}*.js'],
                tasks: ['newer:jshint:test', 'karma']
            },
            sass: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['sass:server', 'autoprefixer']
            },
            html: {
                files: ['<%= yeoman.app %>/templates/**/*.{htm,html}'],
                tasks: ['ngtemplates']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= yeoman.app %>/index.html',
                    '<%= yeoman.app %>/{,*/}*.html',
                    '.tmp/**/*.css',
                    '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
        ngtemplates: {
            app: {
                options: {
                    module: '<%= yeoman.domain %>',
                    standalone: false,
                    htmlmin: {
                        collapseBooleanAttributes: true,
                        collapseWhitespace: true,
                        removeAttributeQuotes: true,
                        removeComments: true, // Only if you don't use comment directives!
                        removeEmptyAttributes: true,
                        removeRedundantAttributes: true,
                        removeScriptTypeAttributes: true,
                        removeStyleLinkTypeAttributes: true,
                        conservativeCollapse: true,
                        preserveLineBreaks: true
                    }
                },
                cwd: 'src',
                src: 'templates/{,**/}*.html',
                dest: '<%= yeoman.dist %>/scripts/templates.js'
            }
        },
        bump: {
            options: {
                files: ['package.json', 'bower.json'],
                updateConfigs: [],
                commit: true,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['-a'],
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'v%VERSION%',
                push: true,
                pushTo: 'origin',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
                globalReplace: false,
                prereleaseName: false,
                regExp: false
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: {
                src: [
                    'Gruntfile.js',
                    '<%= yeoman.app %>/scripts/{,*/}*.js'
                ]
            },
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: ['test/spec/{,*/}*.js']
            }
        },
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    middleware: function(connect) {
                        return [
                            serveStatic('.tmp'),
                            connect().use(
                                '/bower_components',
                                serveStatic('./bower_components')
                            ),
                            serveStatic(appConfig.app)
                        ];
                    }
                }
            },
            test: {
                options: {
                    port: 9001,
                    middleware: function(connect) {
                        return [
                            serveStatic('.tmp'),
                            serveStatic('test'),
                            connect().use(
                                '/bower_components',
                                serveStatic('./bower_components')
                            ),
                            serveStatic(appConfig.app)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    open: true,
                    base: '<%= yeoman.dist %>'
                }
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.dist %>/{,*/}*',
                        '!<%= yeoman.dist %>/.git*'
                    ]
                }]
            },
            server: {
                files: [{
                    src: [
                        '.tmp',
                        '<%= yeoman.dist %>/scripts'
                    ]
                }]
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 3 versions']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles'
                }]
            }
        },
        wiredep: {
            app: {
                src: ['<%= yeoman.app %>/index.html'],
                ignorePath: /\.\.\//
            },
            sass: {
                src: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
                ignorePath: /(\.\.\/){1,2}bower_components\//
            }
        },
        sass: {
            options: {
                imagePath: '../images',
                includePaths: [
                    'bower_components'
                ]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/styles',
                    src: ['*.scss'],
                    dest: '.tmp/styles',
                    ext: '.css'
                }]
            },
            server: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/styles',
                    src: ['*.scss'],
                    dest: '.tmp/styles',
                    ext: '.css'
                }]
            }
        },
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>/scripts/',
                        dest: '<%= yeoman.dist %>/scripts/',
                        src: [
                            '{,**/}*'
                        ]
                    }
                ]
            },
            styles: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '.tmp/styles/',
                        dest: '<%= yeoman.dist %>/',
                        src: [
                            '{,*/}*'
                        ]
                    }
                ]
            }
        },
        babel: {
            options: {
                sourceMap: true,
                presets: ['es2015']
            },
            dist: {

                files: [{
                    expand: true,
                    cwd: 'src/scripts',
                    src: ['**/*.js'],
                    dest: 'dist/scripts',
                    ext: '.js'
                }]
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: [
                    '<%= yeoman.dist %>/scripts/{,**/}*.js'
                ],
                dest: '<%= yeoman.dist %>/<%= yeoman.module %>.js'
            }
        },
        uglify: {
            options: {
                mangle: false,
                banner: '/*! <%= yeoman.module %> v<%= yeoman.version %> */',
                sourceMap: true,
                screwIE8: true
            },
            dist: {
                files: {
                    '<%= yeoman.dist %>/<%= yeoman.module %>.min.js': ['<%= yeoman.dist %>/<%= yeoman.module %>.js'],
                }
            }
        },
        usemin: {
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['.tmp/styles/{,*/}*.css'],
            options: {
                dirs: ['<%= yeoman.dist %>/images'],
                basedir: ['<%= yeoman.dist %>/images'],
                assetsDirs: ['<%= yeoman.dist %>', '<%= yeoman.dist %>/images']
            }
        },
        concurrent: {
            server: [
                'sass:server',
                'copy:styles'
            ],
            test: [
                'copy:styles'
            ],
            dist: [
                'sass',
                'svgmin'
            ]
        },
        svgmin: {
            options: {
                plugins: {
                    removeViewBox: false
                }
            }
        },
        cssmin: {
            options: {
                banner: '/*! <%= yeoman.module %> v<%= yeoman.version %> */',
                sourceMap: true
            },
            target: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>',
                    src: ['*.css', '!*.min.css'],
                    dest: '<%= yeoman.dist %>',
                    ext: '.min.css'
                }]
            }
        },
        replace: {
            dist: {
                options: {
                    patterns: [
                        {
                            match: /v(\d+)\.(\d+)\.(.+)/g,
                            replacement: 'v<%= yeoman.version %>'
                        }
                    ]
                },
                files: [
                    { expand: true, flatten: true, src: ['README.md'], dest: '' }
                ]
            }
        },
        cssUrlEmbed: {
            encodeWithBaseDir: {
                expand: true,
                cwd: '.tmp/styles',
                src: ['{,*/}*.css'],
                dest: '.tmp/styles',
                options: {
                    baseDir: './src/styles'
                }
            }
        },
        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                singleRun: false
            },
            build: {
                configFile: 'test/karma.conf.js',
                singleRun: true
            }
        }
    });


    grunt.registerTask('serve', 'Compile then start a connect web server', function(target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'wiredep',
            'concurrent:server',
            'autoprefixer',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('test', [
        'clean:server',
        'concurrent:test',
        'autoprefixer',
        'connect:test',
        'karma:unit'
    ]);

    grunt.registerTask('build', [
        'clean',
        'babel',
        'karma:build',
        'ngtemplates',
        'replace',
        // 'copy:dist',
        'concat',
        'uglify:dist',
        'concurrent:dist',
        'autoprefixer',
        'cssUrlEmbed',
        'usemin',
        'copy:styles',
        'cssmin',
        'clean:server'
    ]);

    grunt.registerTask('default', [
        'newer:jshint',
        'test',
        'build'
    ]);
};
