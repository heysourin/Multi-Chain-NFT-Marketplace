import "../styles/globals.css";
import Link from "next/link";

function MyApp({ Component, pageProps }) {
  // const connectWallet = async () => {
  //   // setLoading(true);
  //   try {
  //     const { ethereum } = window;

  //     if (!ethereum) {
  //       alert("Metamask not found!");
  //       return;
  //     }

  //     const accounts = await ethereum.request({
  //       method: "eth_requestAccounts",
  //     });

  //     console.log("Connected to", accounts[0]);
  //     setCurrentAccount(accounts[0]);
  //     setLoadingState("Not-loaded");
  //   } catch (err) {
  //     console.error(err.message);
  //     setLoadingState("Not-loaded");
  //   }
  // };
  return (
    <div>
      <nav className="border-b p-6">
        <p className="text-4xl font-bold">Pixel NFT Marketplace</p>
        <div className="flex mt-4">
          <Link href="/" className="mr-4 text-blue-500">
            Home
          </Link>
          <Link href="/create-nft" className="mr-6 text-blue-500">
            Sell NFT
          </Link>
          <Link href="/my-nfts" className="mr-6 text-blue-500">
            My NFTs
          </Link>
          <Link href="/dashboard" className="mr-6 text-blue-500">
            Dashboard
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
