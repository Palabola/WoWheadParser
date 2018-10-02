const Wowhead_npc = require("./WowheadParser/npc");
const Wowhead_go = require("./WowheadParser/gameobject");
const logger = require("./logger.js");
const crawler = require("async-request-loop");

let gob_url_array = [];
let gob_optional_array = [];

for (let index = 200000; index < 325000; index++) {
  gob_url_array.push("https://www.wowhead.com/object=" + index);
  gob_optional_array.push(index);
}

let gob_crawler = new crawler(gob_url_array, gob_optional_array, 2000, 10);

gob_crawler.start_fetch((err, res) => {
  if (err) {
    logger.error(err);
  }
  if (res) {
    //uri , body , optional
    new Wowhead_go(res.optional, res.body);
    logger.info("Update tick: " + res.optional);
  }
});

/*
let npc_url_array = [];
let npc_optional_array = [];

for (let index = 0; index < 155000; index++) {
  npc_url_array.push("https://www.wowhead.com/npc=" + index);
  npc_optional_array.push(index);
}

let npc_crawler = new crawler(npc_url_array, npc_optional_array, 3000, 10);

npc_crawler.start_fetch((err, res) => {
  if (err) {
    logger.error(err);
  }
  if (res) {
    //uri , body , optional
    new Wowhead_npc(res.optional, res.body);
    logger.info("Update tick: " + res.optional);
  }
});
*/
