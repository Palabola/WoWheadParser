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

    replace_quest_start_end(array,table)
    {
          if(array.length == 0)
           return;

          pool.query('REPLACE INTO `'+table+'` (`id`, `quest`) VALUES ?;',
            [array], 
            (error) => {
                            if (error) 
                            {
                            logger.error(array);
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
                            logger.error(array);
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
                            logger.error(array);
                            }
                        }
        );
    }



}

module.exports = DB_API;