import { ethers } from "ethers";
import { useEffect, useRef, useState } from "react";
import ConnectToWallet from '../../components/connect.js'
import { WHITELIST_CONTRACT_ADDRESS, ABI } from '../../constants/whitelist/index'


export default function app() {
    const [walletAddress, setWalletAddress] = useState()
    const web3ModalRef = useRef()
    const [walletConnected, setWalletConnected] = useState(false);
    const [provider, setProvider] = useState({})
    const [isAddressWhitelisted, setIsAddressWhitelisted] = useState(false)
    const [count, setCount] = useState(0)


    const getNoOfWhiteListed = async() =>{
        const _provider = await web3ModalRef.current.connect();
        const _web3Provider = new ethers.providers.Web3Provider(_provider);
        const contract = new ethers.Contract(WHITELIST_CONTRACT_ADDRESS, ABI, _web3Provider);
        const count = await contract.whiteListNumCount();
        setCount(count);
    }


    const addAddressToWhiteist_ = async() => {
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(WHITELIST_CONTRACT_ADDRESS, ABI, signer);
        const txnObject = await contract.addAddressToWhiteList();
        txnObject = await txnObject.wait();
        setIsAddressWhitelisted(true);

        //getNoOfWhiteList
        getNoOfWhiteListed();
    }


    const checkIfAddreessIsWhiteListed = async () => {
        const contract = new ethers.Contract(WHITELIST_CONTRACT_ADDRESS, ABI, provider);
        setIsAddressWhitelisted(await contract.whiteListedAccounts(walletAddress));
    }

    useEffect(() => {

        if (walletConnected) {
            checkIfAddreessIsWhiteListed();
        }
        getNoOfWhiteListed();
    }, [walletConnected, walletAddress])

    

    return (
        <div>



            <ConnectToWallet walletAddress={walletAddress} setWalletAddress={setWalletAddress} walletConnected={walletConnected} setWalletConnected={setWalletConnected} setProvider={setProvider} web3ModalRef={web3ModalRef} />


            {count ? (<p> No of Users WhiteListed: {count}</p>): null}

            {walletConnected ? (isAddressWhitelisted ? (<p>Thanks for joining!</p>) :

                (
                    <div>
                        <button onClick={addAddressToWhiteist_}>
                            Join the Whitelist
                        </button>
                    </div>

                )

            ) : null}

            




        </div>
    );
}