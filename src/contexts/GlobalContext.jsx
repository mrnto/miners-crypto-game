import { createContext, useCallback, useEffect, useState } from 'react';
import Web3 from 'web3';
import { abi as ABI, address as ADDRESS } from '../abi/MinersGame.json';
import { getPrice, getYield } from '../utils';

export const GlobalContext = createContext({});

const disconnectedState = { accounts: [], chainId: "" };
const defaultPlayerState = {
  coins: 0,
  gems: 0,
  timestamp: 0,
  yield: 0,
  miners: [0, 0, 0]
};

export const GlobalContextProvider = ({ children }) => {
  const [wallet, setWallet] = useState(disconnectedState);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [player, setPlayer] = useState(defaultPlayerState);

  // сallback to avoid recreating the function at each rendering
  const updateWallet = useCallback(async providedAccounts => {
    const accounts = providedAccounts ||
      (await window.ethereum.request({ method: "eth_accounts" }));
    
    if (accounts.length === 0) {
      setWallet(disconnectedState);
      return;
    }

    const chainId = await window.ethereum.request({ method: "eth_chainId" });

    setWallet({ accounts, chainId });
  }, []);

  useEffect(() => {
    const getEthProvider = async () => {
      // if ethereum provider is available, event handlers are set up
      if (window.ethereum) {
        updateWallet();
        window.ethereum.on('accountsChanged', updateWallet);
        window.ethereum.on('chainChanged', updateWallet);
      }
    };
    
    getEthProvider();

    // removes the event handlers whenever the MetamaskProvider is unmounted
    return () => {
      window.ethereum?.removeListener('accountsChanged', updateWallet);
      window.ethereum?.removeListener('chainChanged', updateWallet);
    };
  }, [updateWallet]);

  const connectWallet = async () => {
    if (window.ethereum) {
      await window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(accounts => updateWallet(accounts))
        .catch(error => console.log(error));
    } else {
      window.open('https://metamask.io/download/', '_blank');
    }
  };

  useEffect(() => {
    const setWeb3AndContract = async () => {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(ABI, ADDRESS);

      setWeb3(web3);
      setContract(contract);
    };

    setWeb3AndContract();
  }, []);

  useEffect(() => {
    const fetchPlayerData = async () => {
      await contract.methods.players(wallet.accounts[0]).call()
        .then((player) => {
          setPlayer((prevState) => ({
            ...prevState,
            coins: Number(player.coins),
            gems: Number(player.gems),
            timestamp: Number(player.timestamp),
            yield: Number(player.yield)
          }));
        })
        .catch(error => console.log(error));

      await contract.methods.getMiners(wallet.accounts[0]).call()
        .then((miners) => {
          setPlayer((prevState) => ({
            ...prevState,
            miners: miners.map((elem) => Number(elem))
          }));
        })
        .catch(error => console.log(error));
    };

    if (wallet.accounts[0] && contract) {
      fetchPlayerData();
    }
  }, [wallet, contract]);

  useEffect(() => {
    if (contract && player) {
      const listener = contract.events.allEvents({
        filter: { user: wallet.accounts[0] }
      });

      listener.on('data', (event) => {
        switch (event.event) {
          case "BuyCoins":
            setPlayer((prevState) => ({
              ...prevState,
              coins: (player.coins + Number(event.returnValues.coins))
            }));
            break;
          case "CollectGems":
            setPlayer((prevState) => ({
              ...prevState,
              gems: (player.gems + Number(event.returnValues.gems))
            }));
            break;
          case "SellGems":
            setPlayer((prevState) => ({ ...prevState, gems: 0 }));
            break;
          case "SellMiners":
            setPlayer((prevState) => ({
              ...prevState,
              gems: (player.gems + Number(event.returnValues.gems)),
              yield: 0,
              miners: [0, 0, 0]
            }));
            break;
          case "UpgradeMiner":
            let miner = Number(event.returnValues.miner);
            let price = getPrice(miner, player.miners[miner]);
            let yld = getYield(miner, player.miners[miner]);
            let newMiners = [...player.miners];
            newMiners[miner]++;
            setPlayer((prevState) => ({
              ...prevState,
              coins: (player.coins - price),
              yield: (player.yield + yld),
              miners: newMiners
            }));
            break;
        }
      });

      return () => listener.unsubscribe();
    }
  }, [contract, player]);

  return (
    <GlobalContext.Provider
      value={{
        wallet,
        web3,
        contract,
        player,
        connectWallet
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};