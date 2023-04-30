import "../styles/globals.css";
import Link from "next/link";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav className="border-b p-2 bg-gradient-to-b from-gray-900 to-gray-600 ">
        <p className="mx-4 font-extrabold text-transparent text-4xl bg-clip-text bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-gray-200 via-gray-100 to-white">
          Pixel NFT Marketplace
        </p>
        <div className="flex mt-4">
          <Link
            href="/"
            className="block mr-32 py-2 pl-3 pr-4 text-white rounded hover:bg-gray-100 font-semibold text-xl hover:text-black"
          >
            Home
          </Link>
          <Link
            href="/create-nft"
            className="block mr-32 py-2 pl-3 pr-4 text-white rounded hover:bg-gray-100 font-semibold text-xl hover:text-black"
          >
           Create NFT
          </Link>
          <Link
            href="/resell-nft"
            className="block mr-32 py-2 pl-3 pr-4 text-white rounded hover:bg-gray-100 font-semibold text-xl hover:text-black"
          >
            List NFT For Sale
          </Link>
          <Link
            href="/dashboard"
            className="block mr-32 py-2 pl-3 pr-4 text-white rounded hover:bg-gray-100 font-semibold text-xl hover:text-black"
          >
            Creator Dashboard
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;

//          <a href="#" class="block mr-32 py-2 pl-3 pr-4 text-white rounded hover:bg-gray-100 font-semibold text-xl hover:text-black">About</a>
