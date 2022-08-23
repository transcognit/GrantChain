// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract GrantChain is ERC721("GrantChain", "GC") {
    event SystemLog(string indexed EventAction, string indexed Data);

    struct donation {
        string emailId;
        string firstname;
        string lastname;
        string amount;
        bool alloted;
    }

    uint256 public donationCount;
    mapping(uint256 => donation) public donationDetails;

    uint256 public campaignCount;

    uint256 public projectCount;
    mapping(uint256 => uint256[]) public projectbuildils;

    function createBundil(uint _projectCount, uint256 [] memory bundillist) public {
        projectbuildils[_projectCount] = bundillist;
        projectCount += 1;
    }

    function plusCampaignCount() public {
        campaignCount += 1;
    }

    function newDonation(
        string memory _emailId,
        string memory _firstname,
        string memory _lastname,
        string memory _amount,
        bool _alloted
    ) public {
        donationDetails[donationCount] = donation(
            _emailId,
            _firstname,
            _lastname,
            _amount,
            _alloted
        );
        _mint(msg.sender, donationCount);
        emit SystemLog("New Donation", _emailId);
        donationCount += 1;
    }
}
