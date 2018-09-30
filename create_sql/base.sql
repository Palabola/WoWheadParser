CREATE TABLE `creature_parse` (
  `entry` mediumint(8) UNSIGNED NOT NULL DEFAULT '0',
  `modelid1` mediumint(8) UNSIGNED NOT NULL DEFAULT '0',
  `name` char(200) NOT NULL DEFAULT '0',
  `femaleName` char(200) DEFAULT NULL,
  `subname` char(200) DEFAULT NULL,
  `minlevel` smallint(5) NOT NULL DEFAULT '1',
  `maxlevel` smallint(5) NOT NULL DEFAULT '1',
  `spell1` mediumint(8) UNSIGNED NOT NULL DEFAULT '0',
  `spell2` mediumint(8) UNSIGNED NOT NULL DEFAULT '0',
  `spell3` mediumint(8) UNSIGNED NOT NULL DEFAULT '0',
  `spell4` mediumint(8) UNSIGNED NOT NULL DEFAULT '0',
  `spell5` mediumint(8) UNSIGNED NOT NULL DEFAULT '0',
  `spell6` mediumint(8) UNSIGNED NOT NULL DEFAULT '0',
  `spell7` mediumint(8) UNSIGNED NOT NULL DEFAULT '0',
  `spell8` mediumint(8) UNSIGNED NOT NULL DEFAULT '0',
  `mingold` mediumint(8) UNSIGNED NOT NULL DEFAULT '0',
  `maxgold` mediumint(8) UNSIGNED NOT NULL DEFAULT '0',
  `VerifiedBuild` smallint(5) DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='Creature System' ROW_FORMAT=FIXED;


ALTER TABLE `creature_parse`
  ADD PRIMARY KEY (`entry`),
  ADD KEY `idx_name` (`name`);
COMMIT;

CREATE TABLE `pickpocketing_loot_template` (
  `Entry` mediumint(8) UNSIGNED NOT NULL DEFAULT '0',
  `Item` mediumint(8) UNSIGNED NOT NULL DEFAULT '0',
  `Reference` mediumint(8) UNSIGNED NOT NULL DEFAULT '0',
  `Chance` float NOT NULL DEFAULT '100',
  `QuestRequired` tinyint(1) NOT NULL DEFAULT '0',
  `LootMode` smallint(5) UNSIGNED NOT NULL DEFAULT '1',
  `GroupId` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `MinCount` mediumint(6) UNSIGNED NOT NULL DEFAULT '1',
  `MaxCount` mediumint(6) UNSIGNED NOT NULL DEFAULT '1',
  `Comment` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='Loot System' ROW_FORMAT=FIXED;


ALTER TABLE `pickpocketing_loot_template`
  ADD PRIMARY KEY (`Entry`,`Item`);
COMMIT;