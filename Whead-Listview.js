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
                    const regex2 = /_totalCount:(.*), computeDataFunc/gm; // Get _totalcount for Loot percentage

                    this.total_count = regex2.exec(this.data_string);


                    if(list_data)
                    {
                    logger.info('Listview '+list_data[1]);

                    if(list_data[1] == 'item') // Item list
                        {
                            switch(list_data[2]) {
                                case 'drops':
                                    this.loot_query(list_data[4],this.total_count[1]);
                                    break;
                                case 'sells':
                                   // this.loot_query(list_data[4],this.total_count[1]);
                                    break;    
                                default:
                                logger.info('Unhandled Item List Type: '+list_data[2]);
                                return;
                            } 
                        }  

                    if(list_data[1] == 'quest') // Item list
                        {
                            switch(list_data[2]) {
                                case 'starts':
                                //  this.loot_query(data[4],this.total_count[1]);
                                    break;
                                case 'ends':
                                //  this.loot_query(data[4],this.total_count[1]);
                                    break;    
                                default:
                                logger.info('Unhandled Item List Type: '+list_data[2]);
                                return;
                            } 
                        }   
                        
                        if(list_data[1] == 'spell') // Item list
                        {
                            switch(list_data[2]) {
                                case 'abilities':
                                //  this.loot_query(data[4],this.total_count[1]);
                                    break;
                                case 'teaches-recipe':
                                //  this.loot_query(data[4],this.total_count[1]);
                                    break;    
                                default:
                                logger.info('Unhandled Item List Type: '+list_data[2]);
                                return;
                            } 
                        }     

                    }

                }

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

            DP_API.instert_creature_loot_template(loot_query);
        }

        /*
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
        */

 };



 module.exports = Whead_Listview