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


CREATE TABLE `gameobject_questender` (
  `id` mediumint(8) UNSIGNED NOT NULL DEFAULT '0',
  `quest` mediumint(8) UNSIGNED NOT NULL DEFAULT '0' COMMENT 'Quest Identifier'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

ALTER TABLE `gameobject_questender`
  ADD PRIMARY KEY (`id`,`quest`);
COMMIT;

CREATE TABLE `gameobject_queststarter` (
  `id` mediumint(8) UNSIGNED NOT NULL DEFAULT '0',
  `quest` mediumint(8) UNSIGNED NOT NULL DEFAULT '0' COMMENT 'Quest Identifier'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

ALTER TABLE `gameobject_queststarter`
  ADD PRIMARY KEY (`id`,`quest`);
COMMIT;


CREATE TABLE `gameobject_loot_template` (
  `Entry` mediumint(8) UNSIGNED NOT NULL DEFAULT '0',
  `Item` int(10) NOT NULL DEFAULT '0',
  `Reference` mediumint(8) UNSIGNED NOT NULL DEFAULT '0',
  `Chance` float NOT NULL DEFAULT '100',
  `QuestRequired` tinyint(1) NOT NULL DEFAULT '0',
  `LootMode` smallint(5) UNSIGNED NOT NULL DEFAULT '1',
  `GroupId` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `MinCount` mediumint(6) UNSIGNED NOT NULL DEFAULT '1',
  `MaxCount` mediumint(6) UNSIGNED NOT NULL DEFAULT '1',
  `Comment` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='Loot System';


ALTER TABLE `gameobject_loot_template`
  ADD PRIMARY KEY (`Entry`,`Item`),
  ADD KEY `Item` (`Item`);
COMMIT;



CREATE TABLE `item_loot_template` (
  `Entry` mediumint(8) UNSIGNED NOT NULL DEFAULT '0',
  `Item` int(10) NOT NULL DEFAULT '0',
  `Reference` mediumint(8) UNSIGNED NOT NULL DEFAULT '0',
  `Chance` float NOT NULL DEFAULT '100',
  `QuestRequired` tinyint(1) NOT NULL DEFAULT '0',
  `LootMode` smallint(5) UNSIGNED NOT NULL DEFAULT '1',
  `GroupId` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `MinCount` mediumint(6) UNSIGNED NOT NULL DEFAULT '1',
  `MaxCount` mediumint(6) UNSIGNED NOT NULL DEFAULT '1',
  `Comment` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='Loot System' ROW_FORMAT=FIXED;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `item_loot_template`
--
ALTER TABLE `item_loot_template`
  ADD PRIMARY KEY (`Entry`,`Item`);
COMMIT;

CREATE TABLE `disenchant_loot_template` (
  `Entry` mediumint(8) UNSIGNED NOT NULL DEFAULT '0',
  `Item` mediumint(8) NOT NULL DEFAULT '0',
  `Reference` mediumint(8) UNSIGNED NOT NULL DEFAULT '0',
  `Chance` float NOT NULL DEFAULT '100',
  `QuestRequired` tinyint(1) NOT NULL DEFAULT '0',
  `LootMode` smallint(5) UNSIGNED NOT NULL DEFAULT '1',
  `GroupId` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `MinCount` tinyint(3) UNSIGNED NOT NULL DEFAULT '1',
  `MaxCount` tinyint(3) UNSIGNED NOT NULL DEFAULT '1',
  `Comment` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='Loot System' ROW_FORMAT=FIXED;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `disenchant_loot_template`
--
ALTER TABLE `disenchant_loot_template`
  ADD PRIMARY KEY (`Entry`,`Item`);
COMMIT;

CREATE TABLE `milling_loot_template` (
  `Entry` mediumint(8) UNSIGNED NOT NULL DEFAULT '0',
  `Item` int(10) NOT NULL DEFAULT '0',
  `Reference` mediumint(8) UNSIGNED NOT NULL DEFAULT '0',
  `Chance` float NOT NULL DEFAULT '100',
  `QuestRequired` tinyint(1) NOT NULL DEFAULT '0',
  `LootMode` smallint(5) UNSIGNED NOT NULL DEFAULT '1',
  `GroupId` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `MinCount` mediumint(6) UNSIGNED NOT NULL DEFAULT '1',
  `MaxCount` mediumint(6) UNSIGNED NOT NULL DEFAULT '1',
  `Comment` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='Loot System' ROW_FORMAT=FIXED;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `milling_loot_template`
--
ALTER TABLE `milling_loot_template`
  ADD PRIMARY KEY (`Entry`,`Item`);
COMMIT;



CREATE TABLE `prospecting_loot_template` (
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

--
-- Indexes for dumped tables
--

--
-- Indexes for table `prospecting_loot_template`
--
ALTER TABLE `prospecting_loot_template`
  ADD PRIMARY KEY (`Entry`,`Item`);
COMMIT;