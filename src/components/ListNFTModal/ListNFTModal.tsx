import React from 'react';
import dynamic from 'next/dynamic';
import styles from './ListNFTModal.module.scss';
import { getAddressBalance } from 'utils/ethersUtil';
import { getAccount } from 'utils/ethersUtil';

const Modal = dynamic(() => import('hooks/useModal'));
const isServer = typeof window === 'undefined';

interface IProps {
  onClickMakeOffer?: (nftLink: string, price: number) => void;
  onClickBuyNow?: (nftLink: string, price: number) => void;
  onClickListNFT?: (nftLink: string, price: number) => void;
  onClose?: () => void;
}

const ListNFTModal: React.FC<IProps> = ({
  onClickListNFT,
  onClose
}: IProps) => {
  const [nftLink, setNftLink] = React.useState('');
  const [price, setPrice] = React.useState(0);
  const [balance, setBalance] = React.useState('');

  const [user, setUser] = React.useState<any>(null);
  React.useEffect(() => {
    const connect = async () => {
      const account = await getAccount();
      setUser({ account });

      const getInfo = async () => {
        const bal = await getAddressBalance(account);
        setBalance(parseFloat(`${bal}`).toFixed(4));
      };
      getInfo();
    };
    connect();

    
  }, []);
  return (
    <>
      {!isServer && (
        <Modal
          brandColor={'blue'}
          isActive={true}
          onClose={onClose}
          activator={({ setShow }: any) => (
            <div onClick={() => setShow(true)} className={'nftholder'}>
              &nbsp;
            </div>
          )}
        >
          <div className={`modal ${'ntfmodal'}`} style={{ background: 'white', borderColor: 'blue' }}>
            <div className="modal-body">
              <div className={styles.title}>List NFT</div>

              {/* <div style={{ marginBottom: 10 }}>
                <div>Paste the NFT link here:</div>
                <input
                  className="input-box"
                  autoFocus
                  onChange={(ev) => setNftLink(ev.target.value)}
                  placeholder="https://... (NFT Link)"
                />
              </div> */}

              <div className={styles.row}>
                <ul>
                  <li>
                    <div>Enter price</div>
                    <div>
                      <input type="number" onChange={(ev) => setPrice(parseFloat(ev.target.value))} />
                    </div>
                    <div>ETH</div>
                  </li>
                  <li>
                    <div>Your balance</div>
                    <div>
                      <span>{balance}</span>
                    </div>
                    <div>ETH</div>
                  </li>
                </ul>
              </div>

              <div className={styles.footer}>
                <a className="action-btn" onClick={() => onClickListNFT && onClickListNFT(nftLink, price)}>
                  &nbsp;&nbsp;&nbsp; List NFT &nbsp;&nbsp;&nbsp;
                </a>

                <a className="action-btn action-2nd" onClick={() => onClose && onClose()}>
                  Cancel
                </a>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ListNFTModal;
