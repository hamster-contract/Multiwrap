const Multiwrap = artifacts.require("Multiwrap");

contract("Multiwrap", accounts => {
    let multiwrapInstance;

    before(async () => {
        multiwrapInstance = await Multiwrap.new();
    });

    it("should have the correct name and symbol", async () => {
        const name = await multiwrapInstance.name();
        const symbol = await multiwrapInstance.symbol();
        assert.equal(name, "Multiwrap");
        assert.equal(symbol, "MTK");
    });

    it("should allow the admin to add a pauser and a minter role", async () => {
        const admin = accounts[0];
        const pauser = accounts[1];
        const minter = accounts[2];
        await multiwrapInstance.grantRole(await multiwrapInstance.PAUSER_ROLE(), pauser, { from: admin });
        await multiwrapInstance.grantRole(await multiwrapInstance.MINTER_ROLE(), minter, { from: admin });
        const hasPauserRole = await multiwrapInstance.hasRole(await multiwrapInstance.PAUSER_ROLE(), pauser);
        const hasMinterRole = await multiwrapInstance.hasRole(await multiwrapInstance.MINTER_ROLE(), minter);
        assert.equal(hasPauserRole, true);
        assert.equal(hasMinterRole, true);
    });

    it("should allow a minter to safely mint a new token", async () => {
        const minter = accounts[2];
        const uri = "https://example.com/token/123";
        const tokenId = await multiwrapInstance.totalSupply();
        await multiwrapInstance.safeMint(accounts[3], uri, { from: minter });
        const owner = await multiwrapInstance.ownerOf(tokenId);
        assert.equal(owner, accounts[3]);
    });

    it("should allow the admin to pause and unpause the contract", async () => {
        const admin = accounts[0];
        await multiwrapInstance.pause({ from: admin });
        const isPaused = await multiwrapInstance.paused();
        assert.equal(isPaused, true);
        await multiwrapInstance.unpause({ from: admin });
        const isUnpaused = await multiwrapInstance.paused();
        assert.equal(isUnpaused, false);
    });
});
