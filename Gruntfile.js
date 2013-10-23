//process.platform = "win32";
var fs = require('fs'),
path = require('path');
module.exports = function(grunt) {
  var packageJson = fs.readFileSync('./package.json');
  packageJson = JSON.parse(packageJson);

  var config = {
    ios : packageJson.ios,
    android : packageJson.android
  };
  grunt.initConfig({

    // We don't set up any default grunt-contrib-copy or grunt-contrib-clean
    // config, as our own config will handle nicely defining packages and their
    // target directories in a single config file, then setting up the copy
    // config as needed behind the scenes.

    build: config,
    clean : config
  });

  // Even though we're not setting up config for these, we'll be making use of
  // them in our task, so must load them into grunt.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerMultiTask('clean', 'Empty out the WWW directories', function(){
    // Here we setup the config needed for this target in order to clean out the
    // target directory and run the task.
//    var cleanConfig = {},
//    copyConfig = {};
//    this.requiresConfig('clean');
//    cleanConfig[this.target] = [this.data.dir + '*', this.data.dir + '.*'];
//    console.log(cleanConfig);
//    grunt.config('clean', cleanConfig);
//    var util = require('util');
//    console.log(util.inspect(cleanConfig, true, null, true));
//    grunt.task.run('clean:' + this.target);
  });

  // Here's our custom task...
  grunt.registerMultiTask('build', 'Clear and copy the files to relevant dirs for Cordova development', function() {
    var self = this,
    data = this.data,
    done = this.async();

    // If no config has been set, the task should exit.
    this.requiresConfig('build');

    var copyConfig = {};
    
    switch(data.type){
      case "phone":
        // Phone only app, no tablet portion
        if (!data.packagesPhone){
          throw new Error("No phone packages defined");
        }
        copyConfig = _iteratePackages(data.packagesPhone, null, self, copyConfig);
        break;
      case "tablet":
        // Tablet only app, no phone portion
        if (!data.packagesTablet){
         throw new Error("No tablet packages defined");
        }
        copyConfig = _iteratePackages(data.packagesTablet, null, self, copyConfig);
        break;
      case "universal":
        // Expecting just 'packages', so let's do that
        if (!data.packagesPhone || !data.packagesTablet){
          throw new Error("Both phone and tablet packages must be defined");
        }

        copyConfig = _iteratePackages(data.packagesTablet, "tablet", self, copyConfig);
        copyConfig = _iteratePackages(data.packagesPhone, "phone", self, copyConfig);
        break;
      default:
        // Expecting just 'packages', so let's do that
        copyConfig = _iteratePackages(data.packages, null, self);
    }

    // Add cordova.js to copyConfig
    if (data.type==="universal"){
      copyConfig[path.join(self.data.dir, 'phone')] = this.data.js;
      copyConfig[path.join(self.data.dir, 'tablet')] = this.data.js;
    }else{
      copyConfig[self.data.dir] = this.data.js;
    }

    // run the copy task
    _doCopy(copyConfig, done);

  });

  /*
    Iterates over a list of packages, processing them individually
    @param packages A list of packages which we'll make sure contains default
    @param wwwSubDir tablet, phone, or null.
    @param self A reference to scope
   */
  function _iteratePackages(packages, wwwSubDir, self, copyConfig){
    // We always want to include the default package, and we always want it to
    // be the first package included, so subsequent packages files will over-
    // write those.
    packages = (packages.indexOf('default')===0) ? packages : ['default'].concat(packages);
    // For each of the packages we dynamically create the copy config and copy
    // the files over to the appropriate dir.
    for (var i=0; i<packages.length; i++){
      var packageName = packages[i];
      copyConfig = _processPackage(packageName, wwwSubDir, self, copyConfig);
    }
    return copyConfig;
  }

  /*
    Copies the contents of an individual directory.
    @param packageName The name of the package, e.g. 'phone'
    @param wwwSubDir The sub directory being used - can be null
    @param self A reference to current scope
   */
  function _processPackage(packageName, wwwSubDir, self, copyConfig) {
    debugger;
    if (packageName==="" || packageName===null || packageName===undefined){
      return copyConfig;
    }

    var packageGlob = path.join('client', packageName, '*'),
    destination = (wwwSubDir) ? path.join(self.data.dir, wwwSubDir, '/') : self.data.dir;


    // TODO: A bug exists here with multiple packages - we end up with ios/www/phone/(tablet+phone directories)
    copyConfig = copyConfig || {};
    copyConfig[destination] = copyConfig[destination] || [];
    copyConfig[destination].push(packageGlob);
    return copyConfig;
  }
  
  
  function _doCopy(copyConfig, callback){
    var mkdir = "mkdir -p",
    cp = "cp -R";
    if (process.platform === 'win32'){
      mkdir = "mkdir";
      cp = "xcopy";
    }
    var commands = [];
    var flags = (process.platform==="win32") ? " /C /E /Q /Y " : "";
    for (var key in copyConfig){
      if (copyConfig.hasOwnProperty(key)){
        var destination = key,
        source = copyConfig[key],
        c;
        if (typeof source!=="string"){
          for (var i=0; i<source.length; i++){
            var aSource = source[i];
            c = mkdir + " " + destination;
            if (!commands.indexOf(c) && process.platform!=="win32") {
              commands.push(c);
            }
            commands.push(cp + " " + aSource + " " + destination);
          }
        }else{
          c = mkdir + " " + destination;
          if (commands.indexOf(c)===-1  && process.platform!=="win32") {
            commands.push(c);
          }
          commands.push(cp + " " + source + " " + destination);
        }
      }
    }
    // flags need to be appended to each command after replacing /\//g with '\\' and before creating a string out of array.
    for (var i=0; i<commands.length; i++) {
      commands[i] = (process.platform==="win32") ? commands[i].replace(/\//g, '\\') + flags : commands[i];
    }
    
    // Different delimiter to chain commands in different build environments
    commands = (process.platform==="win32") ? commands.join(" & ") :  commands.join(" ; ");
    
    var exec = require('child_process').exec;

    exec(commands, function(error, stdout, stderr){
        if(error) {
          console.log(error || "");
          throw new Error("Error while copying files:" + error);
        } else if (stderr || stdout){
          console.log(stderr || "");
          console.log(stdout || "");
        }
        callback();
    });
  }
  grunt.registerTask('default', 'build');
};