require('dotenv').config()

const mysql      = require('mysql');

const pool = mysql.createPool({
  host     : process.env.MYSQL_HOST,
  user     : process.env.MYSQL_USER,
  password : process.env.MYSQL_PASS,
  database : process.env.MYSQL_DB
});
 
class DB_API {

    instert_creature_loot_template(array)
    {
          if(array.length == 0)
           return;

          pool.query('REPLACE INTO `creature_loot_template` (`Entry`, `Item`, `Reference`, `Chance`, `QuestRequired`, `LootMode`, `GroupId`, `MinCount`, `MaxCount`) VALUES ?;',
            [array], 
           function (error) {
            if (error) 
            {
            logger.error(array);
            }
        });
    }

}

module.exports = DB_API;