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
  const filePath = `dev/pbs/test/${sFileName}`
  fs.writeFileSync(filePath,
    typeof data === 'string' ? data :JSON.stringify(data,null,+space)
  );
}

const yamlFile = `---
 doe: "a deer, a female deer"
 ray: "a drop of golden sun"
 pi: 3.14159
 xmas: true
 french-hens: 3
 calling-birds:
   - huey
   - dewey
   - louie
   - fred
 xmas-fifth-day:
   calling-birds: four
   french-hens: 3
   golden-rings: 5
   partridges:
     count: 1
     location: "a pear tree"
   turtle-doves: two`
const yamlFileLines =  `---
 two: 2
 three: 3
 four: 4
 five: 5
 six: 6
 seven: # 7
   - 8
   - 9
   - 10:
    - 11
 twelve: #12
   thirteen: 13
   # 14 comment
   fifteen: #15
     sixteen: 16
     seventeen: "17"

   nineteen: 19
 twenty: 20`


/**
 * https://yarnpkg.com/package/yaml
 * https://onlineyamltools.com/convert-yaml-to-json
 *
 */
import { parse, stringify, LineCounter, Parser } from 'yaml'

describe('yamlParser', function(){
  it('Parse yamlFile', function(){
    //assert.strictEqual(1,1);//require assert
    // console.log(yamlFile);
    let out;

    out = parse(yamlFile);
    console.log(out);

  });

  it('lexer yamlParser',function(){
    let str;
    // str = yamlFile
    str = yamlFileLines
    const lineCounter = new LineCounter()
    // lineCounter.lineStarts // returns line start offsets?
    const parser = new Parser(lineCounter.addNewLine)
    // for (const token of new Parser().parse(str)){
    // let writeStream = fs.createWriteStream("dev/yamlFileLines.json");
    for (const token of parser.parse(str)){
      // writeStream.write(JSON.stringify(token,null,2))
      // console.dir(token, { depth: null })
      // console.log(token); //token is one yaml document
      // continue;
      // WRite to file if needed

      for (let i = 0; i < token.value.items.length; i++) {
        const item = token.value.items[i];
        // console.log(item);
        const {key,value} = item
        const {source,offset} = key;
        const {line, col} = lineCounter.linePos(offset);
        console.log({source,line,col});
        if(source === 'seven'){
          console.log(value);
          // there is value.type: block-seq | block-map
          // value.items. is the way it goes down

        }

      }
    }


  })

  /**
   * https://github.com/eemeli/yaml/blob/master/docs/07_parsing_yaml.md
   */
  it("line counter example",function (){
    // import { LineCounter, Parser } from 'yaml'

    let out;
    const lineCounter = new LineCounter()
    const parser = new Parser(lineCounter.addNewLine)
    const tokens = parser.parse('foo:\n- 24\n- "42"\n')
    Array.from(tokens) // forces iteration

    out =lineCounter.lineStarts
    console.log(out);
    // > [ 0, 5, 10, 17 ]
    out =lineCounter.linePos(3)
    console.log(out);
    // > { line: 1, col: 4 }
    out =lineCounter.linePos(5)
    console.log(out);
    // > { line: 2, col: 1 }

    //foo: - 24 - "42"n
    out =lineCounter.linePos(15)
    // > line 3 col 6 (5 on sublime)
    console.log(out);
  });

  it('lexer',function(){
    // import { Parser } from 'yaml'
    let str;
    str = 'foo:\n- 24\n- "42"\n'
    // str = 'foo: [24,"42"]\n'
    str=`- hello: world\n- blue: sky`
    for (const token of new Parser().parse(str)){
      // console.dir(token, { depth: null })
      // console.log(token);
      for (let i = 0; i < token.value.items.length; i++) {
        const item = token.value.items[i];
        console.log(item);

      }
    }


  })

});
