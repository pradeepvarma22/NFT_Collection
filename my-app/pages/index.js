import Header from "../components/header"
import Footer from "../components/footer"
import ConnectToWallet from "../components/connect"
import { useState, useRef, useEffect } from "react";
import { ethers } from "ethers";
import { NFT_CONTRACT_ADDRESS, NFT_ABI } from "../constants/nft/index";
import UseDidMountEffect from "../components/useDidMountEffect"


export default function Home() {
  const renderOnFirst = useRef(false);
  const [presaleStarted, setPresaleStarted] = useState(false);
  const [walletAddress, setWalletAddress] = useState()
  const web3ModalRef = useRef()
  const [walletConnected, setWalletConnected] = useState(false);
  const [provider, setProvider] = useState({})
  const [state, setState] = useState({key: false});
  const [presaleEnded, setPresaleEnded] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const isPresaleEnded = async() =>{
    const provider = await web3ModalRef.current.connect();
    const web3provider = new ethers.providers.Web3Provider(provider);
    const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, web3provider);

    // this will return bignumber because preseEnded is a uint256
    // this time return timestamp in seconds
    // 
    const presaleEndtime = await contract.presaleEnded();

    //Date.now returns milli seconds
    // after divifing wwith 1000 to get seconds we will get float value
    const currentTimeInSeconds = Date.now() / 1000;

    // lt means lessThan
    const hasPresaleEnded = presaleEndtime.lt(Math.floor(currentTimeInSeconds));
    setPresaleEnded(hasPresaleEnded);


  }

  const startPresale = async () => {

    const provider = await web3ModalRef.current.connect();
    const web3provider = new ethers.providers.Web3Provider(provider);
    const signer = await web3provider.getSigner();
    const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, signer);
    const ownerOf = await contract.owner();

    if(ownerOf.toLowerCase() === walletAddress.toLowerCase())
    {
      const txn  = await contract.startPresale();
      await txn.wait();
      setPresaleStarted(true);
      setIsOwner(true);
    }
    else
    {
      console.log('Not owner');
    }




  }

  const onPageLoad = async() =>{
    const presaleStarted = await checkIfPresaleStarted();
    if(presaleStarted)
    {
      await isPresaleEnded();
    }
  }

  useEffect(()=>{
    onPageLoad()
  },[])


  const checkIfPresaleStarted = async () => {

    const provider = await web3ModalRef.current.connect();
    const web3Provider = new ethers.providers.Web3Provider(provider);

    const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, web3Provider);

    const isPresaleStarted = await contract.presaleStarted();

    setPresaleStarted(isPresaleStarted);
    console.log(isPresaleStarted);

  }

  UseDidMountEffect( () => {
    // react please run me if 'key' changes, but not on initial render
    // runs only once when i click on wallet 

    checkIfPresaleStarted();
    startPresale();
    
  }, [state.key,walletConnected]);    


  const presaleMint = async()=>
  {
    const provider = await web3ModalRef.current.connect();
    const web3provider = new ethers.providers.Web3Provider(provider);
    const signer = await web3provider.getSigner();
    const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, signer);
    const txn = await contract.presaleMint({
      value : ethers.utils.parseEther("0.01")
    });

    await txn.wait();
    window.alert('Minted presale nft');
  }

  const publiMint = async()=>
  {
    const provider = await web3ModalRef.current.connect();
    const web3provider = new ethers.providers.Web3Provider(provider);
    const signer = await web3provider.getSigner();
    const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, signer);
    const txn = await contract.mint({
      value : ethers.utils.parseEther("0.01")
    });

    await txn.wait();
    window.alert('Minted presale nft');
  }

  function renderBody()
  {
    if(setIsOwner && !presaleStarted && walletConnected)
    {
      return(
        <div>
            <button onClick={startPresale}>Start Presale</button>
        </div>
      );
    }

    if(!presaleStarted && walletConnected)
    {
      // presale not yet started comeback latter
      <div>presale not yet started comeback latter</div>
    }

    if(presaleStarted && !presaleEnded && walletConnected)
    {
       // allow users to mint in presale
       return(
        <div>
          Presale started if your address is whitelisted you can mint nft
          <button onClick={presaleMint}>PresaleMint</button>
        </div>
       )
    }

    if(presaleEnded && walletConnected)
    {
      //allow users to take part in public sale
      return(
        <div>
          Presale Ended Mint crypto dev NFT
          <button onClick={publiMint}>Mint</button>
        </div>
      );
    }

  }


  return (
    <div>

      <Header />

      <main>


        <ConnectToWallet walletAddress={walletAddress} setWalletAddress={setWalletAddress} walletConnected={walletConnected} setWalletConnected={setWalletConnected} setProvider={setProvider} web3ModalRef={web3ModalRef} />
        
          {
            renderBody()
          }



      </main>


      <Footer />
    </div>
  )
}
