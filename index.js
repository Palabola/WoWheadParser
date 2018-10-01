const Wowhead_npc = require("./WowheadParser/npc");
const logger = require("./logger.js");
const crawler = require("./Crawler/crawler");

let npc_url_array = [];
let npc_optional_array = [];

for (let index = 0; index < 155000; index++) {
  npc_url_array.push("https://www.wowhead.com/npc=" + index);
  npc_optional_array.push(index);
}

let new_job = new crawler(npc_url_array, npc_optional_array, 3000, 10);

// Start Fetch with Callback
new_job.start_fetch((err, res) => {
  if (err) {
    logger.error(err);
  }
  if (res) {
    //uri , body , optional
    new Wowhead_npc(res.optional, res.body);
    logger.info("Update tick: " + res.optional);
  }
});
