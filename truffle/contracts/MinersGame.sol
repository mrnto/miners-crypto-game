// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MinersGame {

    struct Player {
        uint256 coins;
        uint256 gems;
        uint256 yield;
        uint256 timestamp;
        uint8[3] miners;
    }

    uint256 constant COIN_FACTOR = 1e14;
    uint256 constant GEM_FACTOR = 1e13;

    mapping(address => Player) public players;

    event BuyCoins(address indexed player, uint256 coins);
    event CollectGems(address indexed player, uint256 gems);
    event SellGems(address indexed player);
    event SellMiners(address indexed player, uint256 gems);
    event UpgradeMiner(address indexed player, uint256 miner);

    function buyCoins() public payable {
        uint256 coins = msg.value / COIN_FACTOR;
        require(coins > 0, "Zero coins");

        address player = msg.sender;
        if (players[player].timestamp == 0) {
            players[player].timestamp = block.timestamp;
        }
        players[player].coins += coins;
        
        emit BuyCoins(player, coins);
    }

    /**
    * @dev The maximum number of gems that can be obtained by the
    * collectGems() function is equal to the yield multiplied by
    * 24 hours, so players need to collect gems every day.
    */
    function collectGems() public {
        address player = msg.sender;
        require(players[player].timestamp > 0, "Zero timestamp");

        uint256 hrs = (block.timestamp - players[player].timestamp) / 3600;
        if (hrs > 24) hrs = 24;

        uint256 gems = players[player].yield * hrs;
        players[player].timestamp = block.timestamp;
        players[player].gems += gems;

        emit CollectGems(player, gems);
    }

    function sellGems() public {
        address player = msg.sender;
        require(players[player].gems > 0, "Zero gems");

        uint256 amount = players[player].gems * GEM_FACTOR;
        amount = address(this).balance < amount ? address(this).balance : amount;
        players[player].gems -= (amount / GEM_FACTOR);
        payable(player).transfer(amount);
        
        emit SellGems(player);
    }
    
    /**
    * @dev When selling miners, the player receives a number
    * of gems equal to the yield multiplied by 14 days of mining.
    *
    * Requirement:
    * - address must have a yield (no yield means no miners,
    * so there is nothing to sell)
    */
    function sellMiners() public {
        address player = msg.sender;
        require(players[player].yield > 0, "Zero yield");
        
        collectGems();

        uint256 gems = players[player].yield * 24 * 14;
        players[player].yield = 0;
        players[player].miners = [0, 0, 0];
        players[player].gems += gems;

        emit SellMiners(player, gems);
    }
    
    function upgradeMiner(uint256 miner) public {
        require(miner < 3, "Max 3 miners");
        
        address player = msg.sender;
        uint256 level = players[player].miners[miner];
        uint256 price = getPrice(miner, level);
        require(players[player].coins >= price, "Not enough coins");

        collectGems();

        players[player].coins -= price;
        players[player].yield += getYield(miner, level);
        players[player].miners[miner]++;

        emit UpgradeMiner(player, miner);
    }

    function getMiners(address player) public view returns (uint8[3] memory) {
        return players[player].miners;
    }

    function getPrice(uint256 miner, uint256 level) internal pure returns (uint256) {
        if (level == 0) return [100, 1000, 10000][miner];
        if (level == 1) return [200, 2000, 20000][miner];
        if (level == 2) return [300, 3000, 30000][miner];
        if (level == 3) return [400, 4000, 40000][miner];
        if (level == 4) return [500, 5000, 50000][miner];
        revert("Max 5 levels");
    }

    function getYield(uint256 miner, uint256 level) internal pure returns (uint256) {
        if (level == 0) return [3, 30, 300][miner];
        if (level == 1) return [4, 40, 400][miner];
        if (level == 2) return [5, 50, 500][miner];
        if (level == 3) return [6, 60, 600][miner];
        if (level == 4) return [7, 70, 700][miner];
        revert("Max 5 levels");
    }
}
