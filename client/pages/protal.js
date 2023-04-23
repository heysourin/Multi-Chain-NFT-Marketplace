import { ethers } from "ethers";
import { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { useRouter } from "next/router";
import Web3 from "web3";
import axios from "axios";
import {
  nftContractABI,
  nftContractAddress,
  resellContractABI,
  resellContractAddress,
} from "../engine/machine";
// const ethers = require("ethers");

export default function Sell() {
  const [user, getUser] = useState([]); //which user is connected
  const [resalePrice, updateresalePrice] = useState({ price: "" });
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [currentAccount, setCurrentAccount] = useState("");

  useEffect(() => {
    // connectUser();
    checkIfWalletIsConnected();
    // connectWallet();
    // getWalletNFTs();
  }, [setNfts, getUser]);

  const router = useRouter();

  const checkIfWalletIsConnected = async () => {
    setLoadingState("loaded");
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log(`Install metamask`);
      } else {
        // console.log("We have ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length) {
        const account = accounts[0];
        // console.log("Authorized account has found", account);
        setCurrentAccount(account);
      } else {
        setCurrentAccount("");
        console.log("No authorized account has found!");
      }
      setLoadingState("not-loaded");
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    setLoadingState("loaded");
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Metamask has found!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      let ac = accounts[0];
      getUser(ac);
      console.log("Got user", user);
      setLoadingState("not-loaded");
    } catch (error) {
      console.error(error);
    }
  };

  async function getWalletNFTs() {
    // setLoadingState('loaded');
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const contract = new ethers.Contract(
          nftContractAddress,
          nftContractABI,
          signer
        );

        // console.log(nftContract);
        const itemArray = [];
        contract.totalSupply().then((result) => {
          let totalSup = parseInt(result, 16);
          for (let i = 0; i < totalSup; i++) {
            var token = i + 1;
            const owner = contract.ownerOf(token).catch(function (error) {
              console.log("Tokens filtered");
            });
            const rawUri = contract.tokenURI(token).catch(function (error) {
              console.log("Tokens filtered");
            });
            const Uri = Promise.resolve(rawUri);
            const getUri = Uri.then((value) => {
              let str = value;
              let cleanUri = str.replace("ipfs://", "https://ipfs.io/ipfs/");
              console.log(cleanUri);
              let metadata = axios.get(cleanUri).catch(function (error) {
                console.log(error.toJson());
              });
              return metadata;
            });
            getUri.then((value) => {
              let rawImg = value.data.image;
              var name = value.data.name;
              var desc = value.data.description;
              let image = rawImg.replace("ipfs://", "https://ipfs.io/ipfs");
              Promise.resolve(owner).then((value) => {
                let ownerW = value;
                let meta = {
                  name: name,
                  img: image,
                  tokenId: token,
                  wallet: ownerW,
                  desc,
                };
                console.log(meta);
                itemArray.push(meta);
              });
            });
          }
        });
        await new Promise((r) => setTimeout(r, 3000));
        setNfts(itemArray);
        setLoadingState("loadede");
      }
      if (loadingState === "loaded" && !nfts.length) {
        return (
          <div>
            <div>
              <h4>No NFTs Found, Connect Wallet</h4>
            </div>
          </div>
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <div>
        <div>
          <div>
            <h4>NFTs of Wallet: {user}</h4>
          </div>
          <button
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            onClick={connectWallet}
          >
            Refresh Wallet
          </button>
          <button
            className="bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded"
            onClick={getWalletNFTs}
          >
            Refresh NFTs
          </button>
        </div>
      </div>
    </div>
  );
}

// export default connectWallet;
// export default checkIfWalletIsConnected;
