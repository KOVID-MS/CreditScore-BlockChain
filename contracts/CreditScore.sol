// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CreditScore {
    address public owner;

    struct Bill {
        uint256 amount;    
        uint256 dueDate;
        bool paid;
        string description;
    }

    mapping(address => uint256) public creditScores;
    mapping(address => Bill[]) public bills;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addBill(address _user, uint256 _amount, string memory _description, uint256 _dueDate) external onlyOwner {
        bills[_user].push(Bill(_amount, _dueDate, false, _description));

        // Initialize credit score to 650 for new users
        if (creditScores[_user] == 0) {
            creditScores[_user] = 650;
        }
    }

    function payBill(address _user, uint256 _billIndex) external {
        require(_billIndex < bills[_user].length, "Invalid bill index");

        Bill storage bill = bills[_user][_billIndex];

        require(!bill.paid, "Bill already paid");

        uint256 currentTime = block.timestamp;

        // Check if payment is made on or before the due date
        if (currentTime <= bill.dueDate) {
            // Mark the bill as paid
            bill.paid = true;

            // Increase credit score by 10 until it reaches 900
            if (creditScores[_user] < 900) {
                creditScores[_user] += 10;
                if (creditScores[_user] > 900) {
                    creditScores[_user] = 900;
                }
            }
        } else {
            // Decrease credit score by 5
            if (creditScores[_user] >= 5) {
                creditScores[_user] -= 5;
            }

            // Mark the bill as paid (even though it's late)
            bill.paid = true;
        }
    }


    function getCreditScore(address _user) external view returns (uint256) {
        return creditScores[_user];
    }

    function viewBills(address _user) external view returns (Bill[] memory, uint256[] memory) {
        uint256 billCount = bills[_user].length;
        Bill[] memory userBills = new Bill[](billCount);
        uint256[] memory indices = new uint256[](billCount);

        for (uint256 i = 0; i < billCount; i++) {
            userBills[i] = bills[_user][i];
            indices[i] = i;
        }

        return (userBills, indices);
    }
}
