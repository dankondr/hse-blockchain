import { expect } from 'chai';
import { ethers } from 'hardhat';
import { keccak256 } from 'ethers/utils';
import { deployContract, getWallets, solidity } from 'ethereum-waffle';

import ERC1155UnfungibleTokenArtifact from '../artifacts/ERC1155UnfungibleToken.json';

describe('ERC1155UnfungibleToken', () => {
    let owner: ethers.Wallet;
    let user: ethers.Wallet;
    let token: ethers.Contract;

    beforeEach(async () => {
        [owner, user] = await getWallets();
        token = await deployContract(owner, ERC1155UnfungibleTokenArtifact);
    });

    it('should mint new tokens with a custom price', async () => {
        const tokenCount = 100;
        const price = ethers.utils.parseEther('0.5');
        const transaction = await token.mint(user.address, tokenCount, price);
        const receipt = await transaction.wait();

        const tokenId = keccak256(ethers.utils.defaultAbiCoder.encode([
            'uint256',
            'address',
            'address'
        ], [
            receipt.timestamp,
            owner.address,
            user.address
        ]));

        const balance = await token.balanceOf(user.address, tokenId);
        expect(balance).to.equal(tokenCount);

        const tokenPrice = await token.tokenPrice(tokenId);
        expect(tokenPrice).to.equal(price);
    });

    it('should only allow the contract owner to mint new tokens', async () => {
        const tokenCount = 100;
        const price = ethers.utils.parseEther('0.5');
        await expect(token.mint(user.address, tokenCount, price, { from: user })).to.be.revertedWith(
            'Only the contract owner can mint new tokens'
        );
    });
});
