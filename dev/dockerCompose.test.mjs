/**
yarn add mocha -D

package.json
  "imports": {
    "##/*": {
      "default": "./*"
    },
  },
  "type": "module",

  jsconfig.json
  {
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "##/*": ["./*"]
    }
  },
  "exclude": ["node_modules", ".nuxt", "dist"]
}



*/
// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
// const assert = require('assert');
// const {describe,it} = require('mocha');
import assert from 'node:assert';
import { describe, it} from 'mocha';
/*
1.
yarn add mocha @babel/polyfill @babel/register @babel/preset-env babel-plugin-module-resolver --dev
yarn add @babel/core --dev
2.
-r @babel/register -r babel-plugin-module-resolver

3.
.babelrc
{

  "presets": ["@babel/preset-env"],
  "plugins": [
    ["module-resolver", {
      "root": ["./src"],
      "alias": {
        "test": "./test",
        "underscore": "lodash",

        "~": "./"
      }
    }]
  ]

}
test specific timeout
this.timeout(500);//500ms
*/
/**
 * Should put this somewhere safe
 * todo filepath needs to be initialized as well...
 * @param fileName .json
 * @param data will automatically be changed
 */
import fs from 'node:fs';
function writeToFile(fileName,data,space=2){
  const sFileName = /\./.test(fileName) ? fileName : fileName + '.json';
  const filePath = `dev/DockerComposeFiles/${sFileName}`
  fs.writeFileSync(filePath,
    typeof data === 'string' ? data :JSON.stringify(data,null,+space)
  );
}

/*
  Try Generating JSON

https://yarnpkg.com/package/yaml
 */
import { parse, stringify } from 'yaml'
describe('dockerCompose.test.mjs', function(){
  it('Docker Compose v3.8', function(){
    //assert.strictEqual(1,1);//require assert
    const dockerCompose = {
      "version": "3.8",
      "services": {
        "host": {
          "hostname": "host",
          "build": ".",
          "image": "ssh_debian:latest",
          "stdin_open": true,
          "tty": true,
          "ports": [
            "2022:22"
          ],
          "command": [
            "sh",
            "-c",
            "service ssh start;hostname;/bin/bash"
          ]
        },
        "deb1": {
          "hostname": "deb1",
          "image": "ssh_debian:latest"
        }
      }
    };
    for (let i = 2; i <= 10; i++) {
      const key = "deb"+i;
      dockerCompose.services[key] = {
        hostname:key,
        "image": "ssh_debian:latest"
      }
    }


    writeToFile("docker-compose-tunneled-guests.yml", stringify(dockerCompose))

  });
});
