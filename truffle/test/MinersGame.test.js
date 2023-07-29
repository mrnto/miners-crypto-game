const MinersGame = artifacts.require("MinersGame");

contract("MinersGame", (accounts) => {
  const [acc1] = accounts;
  var minersGame;

  before(async() => {
    minersGame = await MinersGame.deployed();
  })

  describe("Buying coins", async () => {
    it("should buy coins correctly", async () => {
      await minersGame.buyCoins({ from: acc1, value: 2000000000000000000 });
      let player = await minersGame.players(acc1);

      // should add 2 ETH = 20 000 coins
      assert.equal(player.coins.toNumber(), "20000", "Incorrect coins amount");
    });

    it("should reject transaction", async () => {
      let player = await minersGame.players(acc1);

      try {
        await minersGame.buyCoins({ from: acc1, value: 0 });
      } catch (err) {
        assert.equal(err.reason, "Zero coins", "Incorrect reason");
      }
      player = await minersGame.players(acc1);
      
      // should not change coins amount
      assert.equal(player.coins.toNumber(), "20000", "Incorrect coins amount");
    });
  });

  describe("Upgrading miners", async () => {
    it("should correctly upgrade miner", async () => {
      // the first upgrade of the third miner
      await minersGame.upgradeMiner(2, { from: acc1 });
      
      let miners = await minersGame.getMiners(acc1);
      let player = await minersGame.players(acc1);

      // should take 10000 coins 
      assert.equal(player.coins.toNumber(), "10000", "Incorrect coins amount");
      // should give a yield of 300
      assert.equal(player.yield.toNumber(), "300", "Incorrect yield");
      // should increase level of the third miner
      assert.equal(miners[2].toNumber(), "1", "Incorrect miner level");
    });
    
    it("should reject transaction", async () => {
      try {
        // the second upgrade of the third miner
        await minersGame.upgradeMiner(2, { from: acc1 });
      } catch (err) {
        assert.equal(err.reason, "Not enough coins", "Incorrect reason");
      }

      let miners = await minersGame.getMiners(acc1);
      let player = await minersGame.players(acc1);

      assert.equal(player.coins.toNumber(), "10000", "Incorrect coins amount");
      assert.equal(player.yield.toNumber(), "300", "Incorrect yield");
      assert.equal(miners[2].toNumber(), "1", "Incorrect miner level");
    });
    
    it("should reject transaction", async () => {
      try {
        await minersGame.upgradeMiner(5, { from: acc1 });
      } catch (err) {
        assert.equal(err.reason, "Max 3 miners", "Incorrect reason");
      }

      let miners = await minersGame.getMiners(acc1);
      let player = await minersGame.players(acc1);

      assert.equal(player.coins.toNumber(), "10000", "Incorrect coins amount");
      assert.equal(player.yield.toNumber(), "300", "Incorrect yield");
      assert.equal(miners[2].toNumber(), "1", "Incorrect miner level");
    });
    
    it("should reject last transaction", async () => {
      // max upgrade of the first miner
      for(let i = 0; i < 5; i++) {
        await minersGame.upgradeMiner(0, { from: acc1 });
      }

      try {
        await minersGame.upgradeMiner(0, { from: acc1 });
      } catch (err) {
        assert.equal(err.reason, "Max 5 levels", "Incorrect reason");
      }

      let miners = await minersGame.getMiners(acc1);
      let player = await minersGame.players(acc1);

      // -1500 coins for the first miner
      assert.equal(player.coins.toNumber(), "8500", "Incorrect coins amount");
      // +25 yield from the first miner
      assert.equal(player.yield.toNumber(), "325", "Incorrect yield");
      // max level of the first miner
      assert.equal(miners[0].toNumber(), "5", "Incorrect miner level");
      assert.equal(miners[2].toNumber(), "1", "Incorrect miner level");
    });
  });

  describe("Selling miners", async () => {
    it("should correctly sell miners", async () => {
      await minersGame.sellMiners({ from: acc1 });
      
      let miners = await minersGame.getMiners(acc1);
      let player = await minersGame.players(acc1);

      // gems from selling the first (lvl 5) and the third miners (lvl 1)
      assert.equal(player.gems.toNumber(), "109200", "Incorrect gems amount");
      assert.equal(player.yield.toNumber(), "0", "Incorrect yield");
      assert.equal(miners[0].toNumber(), "0", "Incorrect miner level");
      assert.equal(miners[2].toNumber(), "0", "Incorrect miner level");
    });
    
    it("should reject transaction", async () => {
      try {
        await minersGame.sellMiners({ from: acc1 });
      } catch (err) {
        assert.equal(err.reason, "Zero yield", "Incorrect reason");
      }

      let player = await minersGame.players(acc1);

      assert.equal(player.gems.toNumber(), "109200", "Incorrect gems amount");
    });
  });

  describe("Selling gems", async () => {
    it("should sell gems", async () => {
      await minersGame.sellGems({ from: acc1 });
      
      let player = await minersGame.players(acc1);

      assert.equal(player.gems.toNumber(), "0", "Incorrect gems amount");
    });

    it("should reject transaction", async () => {
      try {
        await minersGame.sellGems({ from: acc1 });
      } catch (err) {
        assert.equal(err.reason, "Zero gems", "Incorrect reason");
      }

      let player = await minersGame.players(acc1);

      assert.equal(player.gems.toNumber(), "0", "Incorrect gems amount");
    });
  });
});
