import { Inter } from "@next/font/google";
import Head from "next/head";
import { useEffect, useState } from "react";
import getServerUri from "@/utilities/get-server-uri";

const inter = Inter({ subsets: ["latin"] });


export default function Home() {
    const [helloWorld, setHelloWorld] = useState("");
    
    useEffect(() => {
      const fetchData = async () => {
        const host = getServerUri();
        try {
          const response = await fetch(`${host}/v1/example`);
          const text = await response.text();
          setHelloWorld(text);
        } catch(error) {
          console.log("Failed to get hello world", error);
        }
      }

      fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>Firebot</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className={`text-2xl font-extrabold ${inter.className}`}>{helloWorld}</div>
      </main>
    </>
  );
}
