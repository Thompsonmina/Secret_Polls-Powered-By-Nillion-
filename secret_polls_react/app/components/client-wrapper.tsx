"use client";

import { ReactNode } from "react";

import { NillionClient } from "@nillion/client-vms";
import { ChainId, ClusterId, Multiaddr, Url } from "@nillion/client-core";

import { NillionProvider } from "@nillion/client-react-hooks";

export const ClientWrapper: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // return <NillionProvider network="photon">{children}</NillionProvider>;
  // return <NillionProvider network="devnet">{children}</NillionProvider>;



  let devnet = {
    clusterId: ClusterId.parse("222257f5-f3ce-4b80-bdbc-0a51f6050996"),
    bootnodes: [
      Multiaddr.parse(
        "/ip4/127.0.0.1/tcp/32869/ws/p2p/12D3KooWMGxv3uv4QrGFF7bbzxmTJThbtiZkHXAgo3nVrMutz6QN",
      ),
    ],
    nilChainId: ChainId.parse("nillion-chain-devnet"),
    nilChainEndpoint: Url.parse("http://127.0.0.1:48102"),
  }

  // let devnet = {
  //   clusterId: ClusterId.parse("9e68173f-9c23-4acc-ba81-4f079b639964"),
  //   bootnodes: [
  //     Multiaddr.parse(
  //       "/ip4/127.0.0.1/tcp/54936/ws/p2p/12D3KooWMvw1hEqm7EWSDEyqTb6pNetUVkepahKY6hixuAuMZfJS",
  //     ),
  //   ],
  //   nilChainId: ChainId.parse("nillion-chain-devnet"),
  //   nilChainEndpoint: Url.parse("http://127.0.0.1:48102"),
  // }

  const client = NillionClient.create()
  client.setNetworkConfig(devnet)

  // console.log(client, "big if true")

  
  // return <NillionProvider client={client}> {children}</NillionProvider>;


  return <NillionProvider network="devnet" config={devnet}>{children}</NillionProvider>;
};
