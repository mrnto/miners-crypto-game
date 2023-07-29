import { useState } from 'react';
import { useGlobalContext } from './contexts/useGlobalContext';
import { getPrice, getYield } from './utils' ;
import { ToastContainer, toast } from 'react-toastify';
import { useDialog } from './components/Dialog/useDialog';
import { useSidebar } from './components/Sidebar/useSidebar';
import Dialog from './components/Dialog';
import Grid from './components/Grid';
import Header from './components/Header';
import Hero from './components/Hero';
import Sidebar from './components/Sidebar';
import coin from './assets/coin.svg';
import clock from './assets/clock.svg';
import gem from './assets/gem.svg';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { wallet, contract, player, connectWallet } = useGlobalContext();
  const { isDialogOpen, openDialog } = useDialog();
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  const [minerIdx, setMinerIdx] = useState(0);

  const buyCoins = async () => {
    await contract.methods.buyCoins()
      .send({ from: wallet.accounts[0], value: 1000000000000000000 })
      .catch(error => console.log(error));
  };

  const collectGems = async () => {
    if (player.yield == 0) return notify("Nothing to collect!");

    await contract.methods.collectGems().send({ from: wallet.accounts[0] })
      .catch(error => console.log(error));
  };

  const sellGems = async () => {
    if (player.gems == 0) return notify("Nothing to sell!");

    await contract.methods.sellGems().send({ from: wallet.accounts[0] })
      .catch(error => console.log(error));
  };

  const sellMiners = async () => {
    if(player.yield == 0) return notify("You don't have any miners!");

    await contract.methods.sellMiners().send({ from: wallet.accounts[0] })
      .catch(error => console.log(error));
  };

  const upgradeMiner = async (miner) => {
    await contract.methods.upgradeMiner(miner).send({ from: wallet.accounts[0] })
      .catch(error => console.log(error));
  };
  
  const handleDialog = result => {
    if (result) {
      if (player.coins < getPrice(minerIdx, player.miners[minerIdx])) {
        openDialog();
        return notify("Not enough coins!");
      }

      upgradeMiner(minerIdx);
    }

    openDialog();
  };

  const notify = (text) => toast.error(text);

  const headerData = [
    {
      val: player.coins,
      img: coin,
      alt: "coins"
    },
    {
      val: player.gems,
      img: gem,
      alt: "gems"
    },
    {
      val: player.yield,
      img: clock,
      alt: "yield"
    }
  ];

  const sidebarData = [
    {
      text: "BUY COINS",
      func: buyCoins
    },
    {
      text: "COLLECT GEMS",
      func: collectGems
    },
    {
      text: "SELL GEMS",
      func: sellGems
    },
    {
      text: "SELL MINERS",
      func: sellMiners
    }
  ];

  return (
    <>
      {wallet.accounts.length < 1 ?
        <Hero onClick={connectWallet} />
        :
        <>
          <Header data={headerData}/>
          <Sidebar
            open={isSidebarOpen}
            toggle={toggleSidebar}
            data={sidebarData}
          />
          <Grid
            miners={player.miners}
            action={openDialog}
            setIdx={setMinerIdx}
          />
          <ToastContainer
            position='bottom-right'
            autoClose={3000}
            hideProgressBar
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable={false}
            pauseOnHover={false}
            theme='dark'
          />
        </>
      }
      
      <Dialog
        text={
          `Upgrade for
          ${getPrice(minerIdx, player.miners[minerIdx])}
          coins?
          You will get
          +${getYield(minerIdx, player.miners[minerIdx])}
          yield.`
        }
        open={isDialogOpen}
        handleConfirm={handleDialog}
      />
    </>
  )
};

export default App;