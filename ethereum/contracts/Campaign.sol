// SPDX-License-Identifier: MIT
pragma solidity ^0.4.17;

/*
    This is file contains two contracts: (1) CampaignFactory contract and (2) Campaign contract.
    
    CampaignFactory keeps track of all instances of the Campaign contract and is responsible for
    deploying new instances the Campaign contract (and storing the resulting address). The reason
    we need this "middle man" contract is for security. This prevents anyone from modifying any
    code during the creation of a new Campaign contract. Additionally, this puts the gas cost
    associated with a new Campaign contract creation to be incurred by the manager, not the "designer"
    of the contracts. 

    The Campaign contract allows for a person (manager) to start a crowdfunding campaign. The
    manager can create requests for campaign contributors to approve/reject the spending of money
    the campaing has accumulated. More than 50% of contributors must approve the request to send
    money to a specific recipient (who likely will exchange a service or good).
*/

// CampaignFactory contract
contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        // Create a new Campaign contract and store the resulting address in newCampaign
        address newCampaign = new Campaign(minimum, msg.sender);

        // Add newCampaign address to the deployedCampaigns array
        deployedCampaigns.push(newCampaign);
    }
    
    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}

// Campaign contract
contract Campaign {
    // A struct is similar to a class, in the sense that we can
    // create an instance of it.
    // A struct essentially allows us to create a new type.
    // A struct can store different types.
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    // Contract variables
    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    // Instead of using an array, which would cost a lot of gas, we will use
    // a mapping that consists of boolean values that correspond to the address
    // of an approver. Mappings DO NOT store keys. We look up values by feeding
    // the key to a hashing function that returns the index of the value that
    // corresponds to the key.
    mapping(address => bool) public approvers;
    // Variable to keep track of how many people have joined this campaign contract
    // Every time someone new donates to the campaign, we increment approversCount
    uint public approversCount;


    // Function modifier to restrict certain functions for manager-only use
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    // Constructor function
    function Campaign(uint minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum; //Wei
    }

    function contribute() public payable{
        // Make sure that the contribution is greater
        // than minimumContribution (in Wei)
        require(msg.value >= minimumContribution);

        // This adds a value to the "approvers" mapping
        // The key (address) will NOT get stored in the mapping, only the value will.
        approvers[msg.sender] = true;

        // Every time someone new donates to the campaign, we increment approversCount
        approversCount++;
    }

    function createRequest(string description, uint value, address recipient) public restricted {
        // Create a new instance of Request and assign all its keys to values
        // An alternative syntax to accomplish the same thing as below is:
        // Request(description, value, recipient, false);
        // However, the below format is preferred
        // Need to specify the "memory" keyword so that Solidity knows to create
        // a copy of the Request object in memory, as opposed to storage.
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });
        requests.push(newRequest);
    }

    function approveRequest(uint index) public {
        // To prevent repetitive code, we can abstract
        // requests[index] into a "storage" variable, of type
        // Request, that we can reuse within this function
        Request storage request = requests[index];

        // Make sure the approver has already contributed to the campaign
        // The line below should return "true" to continue executing code
        require(approvers[msg.sender]);

        // Make sure the approver hasn't voted for this request already
        // The line below should return "false" to continue executing code
        require(!request.approvals[msg.sender]);

        // Update the "approvals" mapping to make sure that this person
        // can't vote on this request again
        request.approvals[msg.sender] = true;

        // Increment the approval count for the specified request
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
        // To prevent repetitive code, we can abstract
        // requests[index] into a "storage" variable, of type
        // Request, that we can reuse within this function
        Request storage request = requests[index];

        // Make sure that more than 50% of people in the campaign have
        // approved (voted "Yes") this request
        require(request.approvalCount > (approversCount / 2));

        // Make sure the "complete" flag for this request is NOT "true"
        // The line below should return "false" to continue executing code
        require(!request.complete);

        // If we made it this far, everything checks out and we are ready
        // to send the money associated with this request to the recipient
        request.recipient.transfer(request.value);

        // Update "complete" flag for this request to "true"
        request.complete = true;
    }

    // This function allows users to get multiple details of a specific
    // campaign as a summary instead of having to make a bunch of function
    // calls to the contract to get each individual piece of information.
    function getSummary() public view returns (uint, uint, uint, uint, address) {
        return (
            minimumContribution,
            this.balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
}