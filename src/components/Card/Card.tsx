import React, { useState, MouseEvent, useEffect } from 'react';
import PlaceBidModal from 'components/PlaceBidModal/PlaceBidModal';
import styles from './CardList.module.scss';
import AcceptOfferModal from 'components/AcceptOfferModal/AcceptOfferModal';
import CancelOfferModal from 'components/CancelOfferModal/CancelOfferModal';
import { BaseCardData, CardData } from 'types/Nft.interface';
import { BlueCheckIcon } from 'components/Icons/BlueCheckIcon';
import { PriceBox } from 'components/PriceBox/PriceBox';
import { addressesEqual } from 'utils/commonUtil';
import { useInView } from 'react-intersection-observer';
import router from 'next/router';
import { Button, Spacer } from '@chakra-ui/react';
import { LISTING_TYPE } from 'utils/constants';
import { NftAction } from 'types';

type Props = {
  data: CardData;
  onClickAction?: (item: any, action: string) => any;
  showItems?: string[];
  action?: string;
  userAccount?: string;
  [key: string]: any;
};

function Card({ data, onClickAction, userAccount, showItems = ['PRICE'], action = '' }: Props) {
  const [placeBidModalShowed, setPlaceBidModalShowed] = useState(false);
  const [acceptOfferModalShowed, setAcceptOfferModalShowed] = useState(false);
  const [cancelOfferModalShowed, setCancelOfferModalShowed] = useState(false);
  const { ref, inView } = useInView({ threshold: 0, rootMargin: '500px 0px 500px 0px' });
  const [order, setOrder] = useState<BaseCardData | undefined>();

  useEffect(() => {
    // prefer infinity listings
    if (data.metadata?.basePriceInEth !== undefined) {
      setOrder(data);
    } else if (data.openseaListing?.metadata?.basePriceInEth !== undefined) {
      setOrder(data.openseaListing);
    }
  }, [data]);

  if (!data) {
    return null;
  }

  let ownedByYou = false;
  if (userAccount) {
    ownedByYou = addressesEqual(data.owner, userAccount);
  }

  const clickCard = () => {
    router.push(`/assets/${data.tokenAddress}/${data.tokenId}`);
  };

  const collectionName = data.collectionName;
  const hasBlueCheck = data.hasBlueCheck;

  if (inView === false) {
    return (
      <div ref={ref} id={`id_${data.id}`} className={styles.card}>
        <img src={data.image} alt="Preloaded Image" style={{ width: 1, height: 1 }} />
      </div>
    );
  }

  const actionButton = () => {
    const isForSale = data.metadata?.basePriceInEth;
    let handler: (ev: MouseEvent) => void = () => console.log('');
    let name;

    if (action === NftAction.ListNft) {
      handler = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        if (onClickAction) {
          onClickAction(data, NftAction.ListNft);
        }
      };
      name = 'List NFT';
    } else if (action === NftAction.BuyNft && !ownedByYou) {
      handler = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        setPlaceBidModalShowed(true);
      };
      name = isForSale ? 'Purchase' : 'Make Offer';
    } else if (action === NftAction.CancelListing) {
      handler = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        if (onClickAction) {
          onClickAction(data, NftAction.CancelListing);
        }
      };
      name = 'Cancel';
    } else if (action === NftAction.AcceptOffer) {
      handler = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        setAcceptOfferModalShowed(true);
      };
      name = 'Accept';
    } else if (action === NftAction.CancelOffer) {
      handler = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        setCancelOfferModalShowed(true);
      };
      name = 'Cancel';
    } else if (action === NftAction.ImportOrder) {
      handler = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        if (onClickAction) {
          onClickAction(data, NftAction.ImportOrder);
        }
      };
      name = 'Import Listing';
    }

    if (name) {
      return (
        <Button className={styles.stadiumButtonBlue} onClick={handler}>
          {name}
        </Button>
      );
    }

    return null;
  };

  const getToken = () => {
    if (data.chainId === '1') {
      return data?.order?.metadata?.listingType !== LISTING_TYPE.ENGLISH_AUCTION ? 'ETH' : 'WETH';
    }
    return 'WETH';
  };

  return (
    <div ref={ref} id={`id_${data.id}`} className={styles.card}>
      {ownedByYou && <div className={styles.ownedTag}>Owned</div>}

      <div className={styles.cardPreview}>
        <img src={data.image} alt="Card preview" />

        <div className={styles.cardControls}></div>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardLine}>
          <div className={styles.cardTitle}>
            {collectionName && (
              <div className={styles.collectionRow}>
                <div className={styles.collectionName}>{collectionName}</div>

                <div style={{ paddingLeft: 6 }}>
                  <BlueCheckIcon hasBlueCheck={hasBlueCheck === true} />
                </div>
              </div>
            )}
            <div className={styles.title}>{data.title}</div>
          </div>
          <PriceBox
            justifyRight
            price={showItems.indexOf('PRICE') >= 0 ? data.price : undefined}
            token={getToken()}
            expirationTime={data?.expirationTime}
          />
        </div>
      </div>
      <Spacer />

      <div className={styles.buttons}>
        <Button
          className={styles.stadiumButtonGray}
          onClick={() => {
            router.push(`/assets/${data.tokenAddress}/${data.tokenId}`);
          }}
        >
          Info
        </Button>
        {actionButton()}
      </div>

      {placeBidModalShowed && <PlaceBidModal data={data} onClose={() => setPlaceBidModalShowed(false)} />}
      {cancelOfferModalShowed && <CancelOfferModal data={data} onClose={() => setCancelOfferModalShowed(false)} />}
      {acceptOfferModalShowed && <AcceptOfferModal data={data} onClose={() => setAcceptOfferModalShowed(false)} />}
    </div>
  );
}

export default Card;
