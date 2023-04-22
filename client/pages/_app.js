import "../styles/globals.css";
import Link from "next/link";
import Image from "next/image";
import Logoz from "../public/Logoz.png";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav className="flex items-center justify-between flex-wrap bg-gray-800 p-6">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <Link href="/">
            <Image src={Logoz} alt="Brand Logo" className="h-16 w-20" />
          </Link>
        </div>
        <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
          <div className="text-sm lg:flex-grow"></div>
          <div>
            <Link
              href="/collection"
              className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-500 mr-4"
            >
              Collection
            </Link>
            <Link
              href="/portal"
              className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-500 mr-4"
            >
              My NFT Portal
            </Link>
            <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
              Connect Wallet
            </button>
          </div>
        </div>
      </nav>

      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
