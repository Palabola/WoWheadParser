const fetch = require('node-fetch');
const DP_API = new(require('./databaseAPI'));

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
        
        fetch('https://www.wowhead.com/npc='+this.npc)
            .then((res) => {
                return res.text();  
            })
            .then((body) =>{
            
            
                this.body = body;
                var res = body.split('new Listview(');
                let scripts = [];

                for (let i = 1; i < res.length; i++) {
                    scripts[i-1] = res[i].split(');')[0]; 
                }   

            
            this.data_string = scripts[0];

            this.state = 1;

            this.extract_loot();
            //this.extract_modell();
 
            })
            .catch((err) => 
            {
                this.state = 1;   
                return;
            });
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


        extract_loot()
        {
                console.log('Extract loot', this.npc);

                const regex = /{template: '(.*)', id: '(.*)', name: (.*) data: (.*)}/gm; // Get List Data JSONs

                this.data = regex.exec(this.data_string);

                const regex2 = /_totalCount:(.*), computeDataFunc/gm; // Get _totalcount for Loot percentage

                this.total_count = regex2.exec(this.data_string);

                if(this.data[1] == undefined)
                {
                 return;
                }    

                if(this.data[1] == 'item') // Item list
                {
                    switch(this.data[2]) {
                        case 'drops':
                            this.loot_query(this.data[4],this.total_count[1]);
                            break;
                        case 'outfit':
                            // None
                            break;
                        default:
                            this.log();
                    } 
                }  
        }




        loot_query(json,total_count)
        {
            if(total_count == undefined) // Loot percentage cannot be calculated
            return;

            let loot_data = eval(json);


            //console.log(loot_data[0]);

            let loot_query = [];
            // entry, item, referrence, chance, questReq, LootMode, Groupid, Min,Max, Comment

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

            loot_query.push([this.npc,loot_data[i].id,0,chance,0,0,groupID,loot_data[i].stack[0],loot_data[i].stack[1]]);
            
            }

         //   if(loot_query.length > 0) // Non Empty Array
           // {
                DP_API.instert_creature_loot_template(loot_query);
           // }

        }



 };



 module.exports = Whead_Listview