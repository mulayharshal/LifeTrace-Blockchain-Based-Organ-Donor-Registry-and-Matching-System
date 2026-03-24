// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract LifeTraceRegistry {

    address public admin;

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin allowed");
        _;
    }

    struct DonorConsent {
        string consentHash;
        bool consentGiven;
        uint256 timestamp;
    }

    struct OrganAllocation {
        uint256 organId;
        uint256 donorId;
        uint256 hospitalId;
        uint256 timestamp;
    }

    struct SurgeryRecord {
        uint256 caseId;
        bool success;
        uint256 timestamp;
    }

    mapping(uint256 => DonorConsent) private donorConsents;
    mapping(uint256 => OrganAllocation) private organAllocations;
    mapping(uint256 => SurgeryRecord) private surgeryRecords;

    // ---------------- DONOR CONSENT ----------------

    function storeDonorConsent(
        uint256 donorId,
        string memory consentHash
    ) public onlyAdmin {
        donorConsents[donorId] = DonorConsent(
            consentHash,
            true,
            block.timestamp
        );
    }

    function getDonorConsent(uint256 donorId)
        public
        view
        returns (string memory, bool, uint256)
    {
        DonorConsent memory dc = donorConsents[donorId];
        return (dc.consentHash, dc.consentGiven, dc.timestamp);
    }

    // ---------------- ORGAN ALLOCATION ----------------

    function storeOrganAllocation(
        uint256 organId,
        uint256 donorId,
        uint256 hospitalId
    ) public onlyAdmin {
        organAllocations[organId] = OrganAllocation(
            organId,
            donorId,
            hospitalId,
            block.timestamp
        );
    }

    function getOrganAllocation(uint256 organId)
        public
        view
        returns (uint256, uint256, uint256, uint256)
    {
        OrganAllocation memory oa = organAllocations[organId];
        return (
            oa.organId,
            oa.donorId,
            oa.hospitalId,
            oa.timestamp
        );
    }

    // ---------------- SURGERY RECORD ----------------

    function storeSurgeryResult(
        uint256 caseId,
        bool success
    ) public onlyAdmin {
        surgeryRecords[caseId] = SurgeryRecord(
            caseId,
            success,
            block.timestamp
        );
    }

    function getSurgeryResult(uint256 caseId)
        public
        view
        returns (uint256, bool, uint256)
    {
        SurgeryRecord memory sr = surgeryRecords[caseId];
        return (
            sr.caseId,
            sr.success,
            sr.timestamp
        );
    }
}
