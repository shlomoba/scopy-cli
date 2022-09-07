#!/usr/bin/env node
const filter = require('lodash/filter');
const reduce = require('lodash/reduce');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

(function run() {
  const { argv: args } = process;
  const { FILE_PATH: filePath } = process.env;
  const settings = require(filePath);
  //Take the 'X-XSRF-TOKEN' & 'Cookie' from the args
  const filtered = filter(args, function (o) {
    return o.includes('X-XSRF-TOKEN:') || o.includes('Cookie:');
  });
  const result = reduce(
    filtered,
    (total, item) => {
      const [key, value] = item.split(':');
      total[key.toLowerCase()] = value.trim();
      return total;
    },
    {}
  );
  const merged = { ...settings, ...result };
  let content = JSON.stringify(merged);
  const fileContent = `const settings = ${content}; \nmodule.exports = settings;`;
  fs.writeFileSync(filePath, fileContent);
})();
