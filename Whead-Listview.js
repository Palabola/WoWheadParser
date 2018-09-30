require('dotenv').config()
const request = require('request');
const logger = require('./logger.js');
const DP_API = new(require('./databaseAPI'));

request.defaults(
    {
    pool: {maxSockets: 1},
    timeout: 3000,
    forever: false,
    });


 class Whead_Listview{

    constructor(npc) {
        this.data_string = '';
        this.data = [];
        this.npc = npc;
        this.state = 0;
        this.body = "";
        this.time_created = Date.now();

        this.creature_parse= {};
        this.creature_parse.model = 0;
        this.creature_parse.minGold = 0;
        this.creature_parse.maxGold = 0;
        this.creature_parse.abilities = [0,0,0,0,0,0,0,0];

        if(this.npc == undefined)
        {
        this.state = 1;
        return;
        }  

        this.fethcing();
        }


    fethcing()
        {
        
            request('https://www.wowhead.com/npc='+this.npc, (err, res, body) => 
            {
                if (err) {
                  logger.error(err);
                  return;
                  }

                    this.body = body;
                    var listiews = body.split('new Listview(');
                    this.data_lists = [];

                    for (let i = 1; i < listiews.length; i++) {
                        this.data_lists[i-1] = listiews[i].split(');')[0]; 
                    }   

                    /* Drop money */
                    let money_regex = /money=(.\d*)/gm; // Get _totalcount for Loot percentage

                    let money_data = money_regex.exec(body);

                    if(money_data)
                    {
                        this.creature_parse.minGold = money_data[1]*0.5;
                        this.creature_parse.maxGold = money_data[1]*1.25;
                    }

                    /* Model Data */
                    let model_regex = /, displayId:(.\d*)/gm; // Get _totalcount for Loot percentage

                    let model_data = model_regex.exec(body);

                    if(model_data)
                    {
                        this.creature_parse.model = model_data[1];
                    }

                    this.state = 1;

                    this.listview_separator();

                    return;
            });

        }            

    
        listview_separator()
        {

                for (let index = 0; index < this.data_lists.length; index++)
                {
                    let listview = this.data_lists[index];

                    const regex = /{template: '(.*)', id: '(.*)', name: (.*) data: (.*)}/gm; // Get List Data JSONs

                    let list_data = regex.exec(listview);

                    /* For Loot Template! */
                    const regex2 = /_totalCount:(.\d*),/gm; // Get _totalcount for Loot percentage

                    let total_count = regex2.exec(listview);

                    if(list_data)
                    {

                    if(list_data[1] == 'item') // Item list
                        {

                            switch(list_data[2]) {
                                case 'drops':
                                    this.loot_query(list_data[4],total_count[1]);
                                    break;
                                case 'pickpocketing':
                                    this.picpocket_query(list_data[4],total_count[1]);
                                    break;    
                                case 'skinning':
                                    this.skinning_query(list_data[4],total_count[1]);
                                    break;    
                                case 'mining':
                                    this.skinning_query(list_data[4],total_count[1]);
                                break;    
                                case 'herbalism':
                                    this.skinning_query(list_data[4],total_count[1]);
                                break;   
                                case 'engineering':
                                    this.skinning_query(list_data[4],total_count[1]);
                                break;      
                                case 'sells':
                                    this.vendor_query(list_data[4]);
                                    break;   
                                case 'outfit':
                                    break;     
                                default:
                                logger.error('Unhandled ItemList Type: '+list_data[2]+' at NPC: '+this.npc);
                            } 
                        }  

                    if(list_data[1] == 'quest') // Item list
                        {
                            switch(list_data[2]) {
                                case 'starts':
                                    this.quest_query(list_data[4],'creature_queststarter');
                                    break;
                                case 'ends':
                                    this.quest_query(list_data[4],'creature_questender');
                                    break;    
                                case 'objective-of':
                                    break;     
                                default:
                                logger.info('Unhandled QuestList Type: '+list_data[2]+' at NPC: '+this.npc);
                            } 
                        }   
                        
                        if(list_data[1] == 'spell') // Item list
                        {
                            switch(list_data[2]) {
                                case 'abilities':
                                    this.parse_abilities(list_data[4]);
                                    break;
                                case 'teaches-recipe':                
                                    break;    
                                default:
                                logger.error('Unhandled Spell ListType: '+list_data[2]+' at NPC: '+this.npc);
                            } 
                        }     

                    }

                }

            
            this.creature_parse_query();

            return;
        }


        creature_parse_query()
        {

            let query = 
            [[
              this.npc,//  `entry`,
              this.creature_parse.model, //  `modelid1`,
              '', //   `name`,
              '', //    `femaleName`,
              '',  //    `subname`,
              1,  //     `minlevel`,
              1,   //     `maxlevel`,
                this.creature_parse.abilities[0],   //      `spell1`,
                this.creature_parse.abilities[1],  //       `spell2`,
                this.creature_parse.abilities[2],  //        `spell3`,
                this.creature_parse.abilities[3],  //        `spell4`,
                this.creature_parse.abilities[4],  //         `spell5`,
                this.creature_parse.abilities[5],  //          `spell6`, 
                this.creature_parse.abilities[6],  //           `spell7`,
                this.creature_parse.abilities[7],   //           `spell8`,
                this.creature_parse.minGold, //            `mingold`,
                this.creature_parse.maxGold,  //            `maxgold`,
                process.env.CURRENT_BUILD //              `VerifiedBuild`    
            ]];

            DP_API.replace_creature_parse(query);
        }

        parse_abilities(json)
        {
            let data = eval(json);

            for (let index = 0; index < data.length; index++) {
                
                if(index > 7) // Max 8 Abilities for Smart Scripts
                continue;    

                this.creature_parse.abilities[index] = data[index].id;     
            }
        }



        quest_query(json,table)
        {
            
            let data = eval(json);

            let query = []; 

            for (let i = 0; i < data.length; i++) {

             query.push(
                    [
                     this.npc,     //  `id`
                     data[i].id // Quest
                    ]); 
            }

             DP_API.replace_quest_start_end(query,table);
        }


        vendor_query(json)
        {
            
            let data = eval(json);

            let query = []; 

            for (let i = 0; i < data.length; i++) {

                data[i].extendedcost = 0;

                if(data[i].cost[0] == 0) // Extended Cost TODO: Add ItemextendedCost
                {
                  data[i].extendedcost = 999;
                }

                query.push(
                    [
                     this.npc,     //   `entry`,
                     0,    // `slot`, 
                     data[i].id,    // `item`,
                     0,    //     `maxcount`,
                     0,    //  `incrtime`,
                     data[i].extendedcost,    //   `ExtendedCost`,
                     1,    ///    `type`,
                     '',     //    `BonusListIDs`,
                     0,     //     `PlayerConditionID`,
                     0,      //     `IgnoreFiltering`,
                     0,      //      `OverridePrice`, 
                     process.env.CURRENT_BUILD // `VerifiedBuild`
                    ]); 
            }

             DP_API.replace_npc_vendor(query);

        }


        picpocket_query(json,total_count)
        {
            if(total_count == undefined) // Loot percentage cannot be calculated
            return;

            let loot_data = eval(json);

            let loot_query = []; 

            for (let i = 0; i < loot_data.length; i++) {

                let chance = loot_data[i].count / Number(total_count);
                let groupID = 0;

                chance *= 100;
                chance = Math.floor(chance * 100) /100;

                if(chance < 0.25) // Under 0.5% inaccureate!
                { 
                        continue;
                }  
  
                loot_query.push(
                    [
                    this.npc,
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

            DP_API.replace_loot_template(loot_query,'pickpocketing_loot_template');
        }


        skinning_query(json,total_count)
        {
            if(total_count == undefined) // Loot percentage cannot be calculated
            return;

            let loot_data = eval(json);

            let loot_query = []; 

            for (let i = 0; i < loot_data.length; i++) {

                let chance = loot_data[i].count / Number(total_count);
                let groupID = 0;

                chance *= 100;
                chance = Math.floor(chance * 100) /100;

                if(chance < 0.25 && groupID == 0) // Under 0.5% inaccureate!
                { 
                    continue;
                }  
  
                loot_query.push(
                    [
                    this.npc,loot_data[i].id, // entry
                    0, // referrence
                    chance, // chance
                    0, // questReq
                    0, // LootMode
                    groupID, //Groupid
                    loot_data[i].stack[0], //Min
                    loot_data[i].stack[1] //Max
                    ]); 
            }

             DP_API.replace_loot_template(loot_query,'skinning_loot_template');

        }

        loot_query(json,total_count)
        {
            if(total_count == undefined) // Loot percentage cannot be calculated
            return;

            let loot_data = eval(json);

            let loot_query = []; 

            for (let i = 0; i < loot_data.length; i++) {

                let chance = loot_data[i].count / Number(total_count);
                let groupID = 0;
                // Special Cases 
                // Chance < 0 Boss Loot    
                if(loot_data[i].count < 0)
                {
                        chance = 0;  
                        groupID = 3;
                }

                chance *= 100;
                chance = Math.floor(chance * 100) /100;

                if(chance < 0.25 && groupID == 0) // Under 0.5% inaccureate!
                { 
                        continue;
                }  
  
                loot_query.push(
                    [
                    this.npc,
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

            DP_API.replace_loot_template(loot_query,'creature_loot_template');
        }


        extract_modell()
        {

            var res = this.body.split('displayId:');
            let scripts = [];

            for (let i = 1; i < res.length; i++) {
                scripts[i-1] = res[i].split('})">')[0]; 
            }   

            //console.log('UPDATE creature_template SET modelid1 =', scripts[0],'where entry =', this.npc,' ;');           

           return; 
        }


 };



 module.exports = Whead_Listview