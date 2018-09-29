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
          pool.query('REPLACE INTO `creature_loot_template` (`Entry`, `Item`, `Reference`, `Chance`, `QuestRequired`, `LootMode`, `GroupId`, `MinCount`, `MaxCount`) VALUES ?;',
            [array], 
           function (error) {
            if (error) 
            {
            console.log(array);
            throw err;
            }
        });
    }

}

module.exports = DB_API;