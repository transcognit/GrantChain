// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract GrantChain {
    event SystemLog(string indexed EventAction, string indexed Data);

    struct donation {
        string emailId;
        string firstname;
        string lastname;
        string campaignID;
        string campaignName;
        string amount;
    }

    uint256 public donationCount;
    mapping(uint256 => donation) public donationDetails;

    function newDonation(
        string memory _emailId,
        string memory _firstname,
        string memory _lastname,
        string memory _campaignName,
        string memory _campaignID,
        string memory _amount
    ) public {
        donationDetails[donationCount] = donation(
            _emailId,
            _firstname,
            _lastname,
            _campaignName,
            _campaignID,
            _amount
        );
        emit SystemLog("New Donation", _emailId);
        donationCount += 1;
    }
}
