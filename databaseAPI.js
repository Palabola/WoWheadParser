require('dotenv').config()
const logger = require('./logger.js');

const mysql      = require('mysql');

const pool = mysql.createPool({
  host     : process.env.MYSQL_HOST,
  user     : process.env.MYSQL_USER,
  password : process.env.MYSQL_PASS,
  database : process.env.MYSQL_DB
});
 
class DB_API {


    replace_creature_parse(array)
    {
          if(array.length == 0)
           return;

          pool.query('REPLACE INTO `creature_parse` (`entry`, `modelid1`, `name`, `femaleName`, `subname`, `minlevel`, `maxlevel`, `spell1`, `spell2`, `spell3`, `spell4`, `spell5`, `spell6`, `spell7`, `spell8`, `mingold`, `maxgold`, `VerifiedBuild`) VALUES ?;',
            [array], 
            (error) => {
                            if (error) 
                            {
                            logger.error('Creature parse: '+array);
                            }
                        }
        );
    }

    replace_quest_start_end(array,table)
    {
          if(array.length == 0)
           return;

          pool.query('REPLACE INTO `'+table+'` (`id`, `quest`) VALUES ?;',
            [array], 
            (error) => {
                            if (error) 
                            {
                            logger.error('replace_quest_start_end: '+array);
                            }
                        }
        );
    }

    replace_npc_vendor(array)
    {
          if(array.length == 0)
           return;

          pool.query('REPLACE INTO `npc_vendor` (`entry`, `slot`, `item`, `maxcount`, `incrtime`, `ExtendedCost`, `type`, `BonusListIDs`, `PlayerConditionID`, `IgnoreFiltering`, `OverridePrice`, `VerifiedBuild`) VALUES ?;',
            [array], 
            (error) => {
                            if (error) 
                            {
                            logger.error('replace_npc_vendor: '+array);
                            }
                        }
        );
    }


    replace_loot_template(array,template = '')
    {
          if(array.length == 0)
           return;

          if(template == '')
          return; 

          pool.query('REPLACE INTO `'+template+'` (`Entry`, `Item`, `Reference`, `Chance`, `QuestRequired`, `LootMode`, `GroupId`, `MinCount`, `MaxCount`) VALUES ?;',
            [array], 
            (error) => {
                            if (error) 
                            {
                            logger.error('replace_'+template+': '+array);
                            }
                        }
        );
    }



}

module.exports = DB_API;