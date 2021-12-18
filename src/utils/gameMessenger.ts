import { getAccount } from 'utils/ethersUtil';
import { apiGet } from './apiUtil';

export class GameMessenger {
  callback: (arg: object) => void;
  chainId: string;
  tokenAddress: string;
  tokenId: number;

  constructor(
    iframeWindow: Window,
    chainId: string,
    tokenAddress: string,
    tokenId: number,
    callback: (arg: object) => void
  ) {
    console.log('GameMessenger constructor');

    this.callback = callback;
    this.chainId = chainId;
    this.tokenAddress = tokenAddress;
    this.tokenId = tokenId;

    window.addEventListener('message', this.listener);

    // tell game we are ready
    this.sendToGame(iframeWindow, 'ready', '');
  }

  dispose = () => {
    window.removeEventListener('message', this.listener);
  };

  // MessageEventSource ? for sender, didn't work
  sendToGame = (sender: any, message: string, param: string) => {
    // console.log(`GameMessenger sendToGame ${param} ${message}`);

    sender.postMessage(
      {
        from: 'host',
        message: message,
        param: param
      },
      '*'
    );
  };

  getLevelImages = async () => {
    const levelImages: string[] = [];
    const levelScores = [0, 44, 125, 317, 765, 1789, 4093, 9213, 20477, 45053, 98301, 212989, 458749, 983037, 2097149];
    for (const score of levelScores) {
      const { result, error } = await apiGet(`/nfts/doge2048/level-images`, {
        chainId: this.chainId,
        score,
        numPlays: score,
        dogBalance: score
      });
      if (!error) {
        const imageUrl = result['image'];
        levelImages.push(imageUrl);
      }
    }
    return levelImages;
  };

  nftImage = async () => {
    // todo: adi change chain name and address and token id
    const { result, error } = await apiGet(`/nfts/localhost/${this.tokenAddress}/${this.tokenId}`);

    if (!error) {
      const imageUrl = result['image'];
      return imageUrl;
    }

    return '';
  };

  listener = async (event: any) => {
    if (event.data && event.data.from === 'game') {
      switch (event.data.message) {
        case 'game-state':
          const address = await getAccount();

          const highScore = 887723;
          const numPlays = 44;

          this.sendToGame(event.source!, 'game-state', JSON.stringify({ address, highScore, numPlays }));
          break;

        case 'game-results':
          console.log('game result', event.data.param);
          // TODO: Adi handle score {score: 100}
          // number of plays
          // update score
          break;

        case 'deposit-dog':
          console.log('deposit-dog');
          // TODO: Adi show metamask

          // this.sendToGame(event.source!, 'state-update', JSON.stringify(levelImages));
          break;

        case 'level-images':
          const levelImages = await this.getLevelImages();

          this.sendToGame(event.source!, 'level-images', JSON.stringify(levelImages));
          break;

        case 'nft-image':
          const nft = await this.nftImage();

          this.sendToGame(event.source!, 'nft-image', nft);
          break;

        default:
          console.log(`GM: event not handled ${event.data.toString()}`);
          break;
      }
    }
  };
}
