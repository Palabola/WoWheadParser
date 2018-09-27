const fetch = require('node-fetch');


 class Whead_Listview{

    constructor(npc) {
        this.data_string = '';
        this.data = [];
        this.npc = npc;
        this.state = 0;

        this.fethcing();
        }


    fethcing()
    {
        fetch('https://www.wowhead.com/npc='+this.npc)
            .then((res) => {
                return res.text();  
            })
            .then((body) =>{
            
                var res = body.split('new Listview(');
                let scripts = [];

                for (let i = 1; i < res.length; i++) {
                    scripts[i-1] = res[i].split(');')[0]; 
                }   


            this.data_string = scripts[0];

            this.state = 1;
            this.extract();
   
            }).catch(() => {
                this.state = 1;   
                return;
              });
        }            


        extract()
        {
                const regex = /{template: '(.*)', id: '(.*)', name: (.*) data: (.*)}/gm;

                    this.data = regex.exec(this.data_string);

                if(this.data[1] == undefined)
                {
                 this.state = 1;   
                 return;
                }    
               
                if(this.data[1] == 'item') // Item list
                {

                    switch(this.data[2]) {
                        case 'drops':
                            this.loot_extract(this.data[4]);
                            break;
                        case 'outfit':
                            // None
                            break;
                        default:
                            this.log();
                    } 
                }  
        }

        loot_extract(json)
        {
            let loot_data = eval(json);

            //console.log(loot_data[0]);

            console.log(this.npc);

            let loot_query;
            // entry, item, referrence, chance, questReq, LootMode, Groupid, Min,Max, Comment

            for (let i = 0; i < loot_data.length; i++) {

            
            loot_query = [this.npc,loot_data[i].id,0,];
            }

        }



 };



 module.exports = Whead_Listview