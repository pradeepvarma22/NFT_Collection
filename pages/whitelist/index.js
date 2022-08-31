import Head from 'next/head'
import Image from 'next/image'
import WhitelistAPP from "./myApp"

export default function Home() {
  return (
    <div>
      <Head>
        <title>Whitelist</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>

        <WhitelistAPP />
      </main>

      <footer>
      </footer>
    </div>
  )
}
