import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { useEffect, useRef, useState } from "react";

const providerOptions = {}

export default function connectToWallet({walletAddress , setWalletAddress,walletConnected, setWalletConnected, setProvider, web3ModalRef}) {


    
    const connect = async () => {

        const provider = await getProviderOrSigner(false);
        let accounts = await provider.send("eth_requestAccounts", []);
        let account = accounts[0];   
        setProvider(provider);
        ethereum.on('accountsChanged', async()=>{
            provider = await getProviderOrSigner(false);
            accounts = await provider.send("eth_requestAccounts", []);
            account = accounts[0];
            console.log(account);
            setWalletAddress(ethers.utils.getAddress(account));
            setProvider(provider);
        });
        setWalletAddress(ethers.utils.getAddress(account));                                 // address checksum:    ethers.utils.getAddress
        

        // update walletConnected = true
        setWalletConnected(true);

    }


    const getProviderOrSigner = async (needSigner = false) => {
        // we need to gain acess to the provider/ signer from MetaMask

        const provider = await web3ModalRef.current.connect();            // it will pop up metamask

        const web3Provider = new ethers.providers.Web3Provider(provider);

        // if user not connected to rinkeby tell user to connect to rinkeby

        const { chainId } = await web3Provider.getNetwork();

        if (chainId != 4) {
            alert('please switch to rinkeby network');
            throw new Error("Incorrect Network");
        }
        setProvider(true);
        if (needSigner) {

            const signer = web3Provider.getSigner();
            return signer;
        }
        return web3Provider;
    }


    useEffect(() => {

        if (!walletConnected) {

            // web3  modal instance
            web3ModalRef.current = new Web3Modal({

                network: "rinkeby",
                providerOptions: {},                         //by default metamask will be present
                disableInjectedProvider: false
            });

            //once web3Modal Instance is created we need to connect our wallet
            // connect();
        }


    }, [])


    return (
        <div>
            {!walletConnected ?  (      <button onClick={connect}>Connect to Wallet</button>      ): (<p>{walletAddress}</p>) }
        </div>
    );
}