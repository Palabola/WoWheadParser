require("dotenv").config();
const logger = require("../logger.js");
const DP_API = new (require("./databaseAPI"))();

class Wowhead_item_parser {
  constructor(entry, body) {
    this.entry = entry;
    this.body = body;
    this.data_lists = [];

    this.parse();
  }

  parse() {
    var listiews = this.body.split("new Listview(");

    for (let i = 1; i < listiews.length; i++) {
      this.data_lists[i - 1] = listiews[i].split(");")[0];
    }

    this.listview_separator();

    return;
  }

  listview_separator() {
    for (let index = 0; index < this.data_lists.length; index++) {
      let listview = this.data_lists[index];

      listview = listview.replace(/(\r\n|\n|\r)/gm, " "); // Clean up from line breaks

      const regex = /{template: '(.*)', id: '(.*)', name: (.*) data: (.*)}/gm; // Get List Data JSONs

      let list_data = regex.exec(listview);

      /* For Loot Template! */
      const regex2 = /_totalCount:(.\d*),/gm; // Get _totalcount for Loot percentage

      let total_count = regex2.exec(listview);

      if (list_data) {
        if (list_data[1] == "item") {
          // Item list
          switch (list_data[2]) {
            case "contains":
              this.multi_loot_query(
                list_data[4],
                total_count[1],
                "item_loot_template"
              );
              break;
            case "disenchanting":
              this.multi_loot_query(
                list_data[4],
                total_count[1],
                "disenchant_loot_template"
              );
              break;
            case "milling":
              this.multi_loot_query(
                list_data[4],
                total_count[1],
                "milling_loot_template"
              );
              break;
            case "prospecting":
              this.multi_loot_query(
                list_data[4],
                total_count[1],
                "prospecting_loot_template"
              );
              break;
            case "see-also":
              break;
            case "items":
              break;
            case "can-be-placed-in":
              break;
            case "shared-cooldown":
              break;
            case "contained-in-item":
              break;
            case "taught-by-item":
              break;
            case "same-model-as":
              break;
            case "prospected-from":
              break;
            case "milled-from":
              break;
            case "creates":
              break;
            case "currency-for":
              break;
            default:
              logger.error(
                "Unhandled ItemList Type: " +
                  list_data[2] +
                  " at Item: " +
                  this.entry
              );
          }
        }
      }
    }

    return;
  }

  multi_loot_query(json, total_count, table) {
    if (total_count == undefined)
      // Loot percentage cannot be calculated
      return;

    let loot_data = eval(json);

    let loot_query = [];

    for (let i = 0; i < loot_data.length; i++) {
      let chance = loot_data[i].count / Number(total_count);
      let groupID = 0;

      chance *= 100;
      chance = Math.floor(chance * 100) / 100;

      if (chance < 0.25) {
        // Under 0.5% inaccureate!
        continue;
      }

      loot_query.push([
        this.entry,
        loot_data[i].id, // entry
        0, // referrence
        chance, // chance
        0, // questReq
        0, // LootMode
        groupID, //Groupid
        loot_data[i].stack[0], //Min
        loot_data[i].stack[1] //Max
      ]);
    }

    DP_API.replace_loot_template(loot_query, table);
  }
}

module.exports = Wowhead_item_parser;
