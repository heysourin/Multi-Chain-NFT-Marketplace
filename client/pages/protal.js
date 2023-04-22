import { ethers } from "ethers";
import { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { useRouter } from "next/router";
import Web3 from "web3";
import axios from "axios";
import {
  nftnftContractABI,
  nftnftContractAddress,
  resellnftContractABI,
  resellnftContractAddress,
} from "../engine/machine";
// const ethers = require("ethers");

export default function Sell() {
  const [user, getUser] = useState([]); //which user is connected
  const [resalePrice, updateresalePrice] = useState({ price: "" });
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState(true);
  const [currentAccount, setCurrentAccount] = useState("");

  useEffect(() => {
    // connectUser();
    checkIfWalletIsConnected();
    connectWallet();
    getWalletNFTs();
  }, [setNfts, getUser]);

  const router = useRouter();

  const checkIfWalletIsConnected = async () => {
    setLoadingState(true);
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
      setLoadingState(false);
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    setLoadingState(true);
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
      setLoadingState(false);
    } catch (error) {
      console.error(error);
    }
  };

  async function getWalletNFTs() {
    setLoadingState(true);
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const nftContract = new ethers.nftContract(
          nftnftContractAddress,
          nftnftContractABI,
          signer
        );
        const totsup = await nftContract.totalSupply();
        console.log(parseInt(totsup,16));
        const itemArray = [];
        // nftContract.totalSupply().then((result) => {
        //   let totalSup = parseInt(result, 16);
        //   console.log(totalSup);

        //   for (let i = 0; i < totalSup; i++) {
        //     var token = i + 1;
        //     const owner = nftContract.ownerOf(token).catch(function (error) {
        //       console.log("Tokens filtered");
        //     });
        //   }
        // });
      }
    } catch (error) {
      console.error(error);
    }
  }
}
