// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IWhiteList
{
    function whiteListedAccounts(address) external view returns(bool);
}