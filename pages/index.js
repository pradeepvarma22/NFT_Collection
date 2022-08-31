import Header from "../components/header"
import Footer from "../components/footer"
import ConnectToWallet from "../components/connect"
import { useState, useRef, useEffect } from "react";
import { ethers } from "ethers";
import { NFT_CONTRACT_ADDRESS, NFT_ABI } from "../constants/nft/index";

export default function Home() {
  const [presaleStarted, setPresaleStarted] = useState(false);
  const [walletAddress, setWalletAddress] = useState()
  const web3ModalRef = useRef()
  const [walletConnected, setWalletConnected] = useState(false);
  const [provider, setProvider] = useState({})


  const startPresale = async () => {

    

  }

  const checkIfPresaleStarted = async () => {

    const provider = await web3ModalRef.current.connect();
    const web3Provider = new ethers.providers.Web3Provider(provider);

    const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, web3Provider);

    const isPresaleStarted = await contract.presaleStarted();

    setPresaleStarted(isPresaleStarted);

  }






  useEffect(() => {

    checkIfPresaleStarted();

  }, [walletConnected]);






  return (
    <div>

      <Header />

      <main>


        <ConnectToWallet walletAddress={walletAddress} setWalletAddress={setWalletAddress} walletConnected={walletConnected} setWalletConnected={setWalletConnected} setProvider={setProvider} web3ModalRef={web3ModalRef} />
        {walletConnected ? (

          <div>









          </div>

        ) : null}




      </main>


      <Footer />
    </div>
  )
}
