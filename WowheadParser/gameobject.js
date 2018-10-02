require("dotenv").config();
const logger = require("../logger.js");
const DP_API = new (require("./databaseAPI"))();

class Wowhead_go_parser {
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
              this.loot_query(list_data[4], total_count[1]);
              break;
            case "pickpocketing":
              this.loot_query(list_data[4], total_count[1]);
              break;
            case "skinning":
              this.loot_query(list_data[4], total_count[1]);
              break;
            case "mining":
              this.loot_query(list_data[4], total_count[1]);
              break;
            case "herbalism":
              this.loot_query(list_data[4], total_count[1]);
              break;
            case "engineering":
              this.loot_query(list_data[4], total_count[1]);
              break;
            case "sells":
              // this.vendor_query(list_data[4]);
              break;
            case "summoned-by":
              break;
            default:
              logger.error(
                "Unhandled ItemList Type: " +
                  list_data[2] +
                  " at GO: " +
                  this.entry
              );
          }
        }

        if (list_data[1] == "quest") {
          // Item list
          switch (list_data[2]) {
            case "starts":
              this.quest_query(list_data[4], "gameobject_queststarter");
              break;
            case "ends":
              this.quest_query(list_data[4], "gameobject_questender");
              break;
            case "objective-of":
              break;
            default:
              logger.info(
                "Unhandled QuestList Type: " +
                  list_data[2] +
                  " at GO: " +
                  this.entry
              );
          }
        }

        if (list_data[1] == "spell") {
          // Item list
          switch (list_data[2]) {
            case "abilities":
              //this.parse_abilities(list_data[4]);
              break;
            case "controlled-abilities":
              break;
            case "teaches-recipe":
              break;
            case "teaches-ability":
              break;
            case "teaches-other":
              break;
            default:
              logger.error(
                "Unhandled Spell ListType: " +
                  list_data[2] +
                  " at GO: " +
                  this.entry
              );
          }
        }
      }
    }

    return;
  }

  quest_query(json, table) {
    let data = eval(json);

    let query = [];

    for (let i = 0; i < data.length; i++) {
      query.push([
        this.entry, //  `id`
        data[i].id // Quest
      ]);
    }

    DP_API.replace_quest_start_end(query, table);
  }

  loot_query(json, total_count) {
    if (total_count == undefined)
      // Loot percentage cannot be calculated
      return;

    let loot_data = eval(json);

    let loot_query = [];

    for (let i = 0; i < loot_data.length; i++) {
      let chance = loot_data[i].count / Number(total_count);
      let groupID = 0;
      // Special Cases
      // Chance < 0 Boss Loot
      if (loot_data[i].count < 0) {
        chance = 0;
        groupID = 3;
      }

      chance *= 100;
      chance = Math.floor(chance * 100) / 100;

      if (chance < 0.25 && groupID == 0) {
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

    DP_API.replace_loot_template(loot_query, "gameobject_loot_template");
  }
}

module.exports = Wowhead_go_parser;
