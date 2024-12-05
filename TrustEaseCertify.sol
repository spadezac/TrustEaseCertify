// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract TrustEaseCertify {
    struct Certificate {
        string candidate_name;
        string template;
    }
    mapping(bytes32 => Certificate) public certificates;
    event certificateGenerated(bytes32 certificate_id);
    address public owner;

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert();
        }
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function generateCertificate(
        string memory _candidate_name,
        string memory _template
    ) public onlyOwner {
        bytes32 _certificate_id = keccak256(
            abi.encodePacked(_candidate_name, _template)
        );
        require(
            bytes(certificates[_certificate_id].candidate_name).length == 0,
            "Certificate with this ID already exists"
        );

        Certificate memory cert = Certificate({
            candidate_name: _candidate_name,
            template: _template
        });

        certificates[_certificate_id] = cert;

        emit certificateGenerated(_certificate_id);
    }

    function generateMultiCertificate(
        string[] memory _candidate_name,
        string memory _template
    ) public onlyOwner {
        for (uint256 i = 0; i < _candidate_name.length; i++) {
            bytes32 _certificate_id = keccak256(
                abi.encodePacked(_candidate_name[i], _template)
            );

            if (
                bytes(certificates[_certificate_id].candidate_name).length != 0
            ) {
                revert();
            }

            Certificate memory cert = Certificate({
                candidate_name: _candidate_name[i],
                template: _template
            });

            certificates[_certificate_id] = cert;

            emit certificateGenerated(_certificate_id);
        }
    }

    function getCertificate(bytes32 _certificate_id)
        public
        view
        returns (string memory _candidate_name, string memory _template)
    {
        Certificate memory cert = certificates[_certificate_id];

        require(
            bytes(certificates[_certificate_id].candidate_name).length != 0,
            "Certificate with this ID does not exist"
        );

        return (cert.candidate_name, cert.template);
    }

    function isVerified(bytes32 _certificate_id) public view returns (bool) {
        return bytes(certificates[_certificate_id].candidate_name).length != 0;
    }
}