import React, { useState } from 'react';
import styles from './scss/MakeOfferForm.module.scss';
import { CardData, Order } from 'types/Nft.interface';
import { getOpenSeaport } from 'utils/ethersUtil';
import { useAppContext } from 'utils/context/AppContext';
import { GenericError } from 'types';
import { Button, Input } from '@chakra-ui/react';
import { PriceBox } from 'components/PriceBox/PriceBox';
import { getToken, stringToFloat } from 'utils/commonUtil';
import { DatePicker } from 'components/DatePicker/DatePicker';
import { Label, Title } from 'components/Text/Text';

interface IProps {
  data: CardData;
  order: Order;
  onComplete: () => void;
}

export const MakeOfferForm: React.FC<IProps> = ({ onComplete, data, order }: IProps) => {
  const { user, showAppError, showAppMessage } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expiryTimeSeconds, setExpiryTimeSeconds] = useState(0);
  const [expiryDate, setExpiryDate] = useState<Date | undefined>();
  const [offerPrice, setOfferPrice] = useState(0);
  const token = getToken(order.paymentToken);

  const makeAnOffer = () => {
    if (offerPrice <= 0) {
      showAppError(`Offer Price must be greater than 0.`);
      return;
    }
    if (token === 'WETH') {
      const basePriceInEthNum = data.metadata?.basePriceInEth ?? 0; // validate: offer price must be >= min price:
      if (offerPrice < basePriceInEthNum) {
        showAppError(`Offer Price must be greater than Minimum Price ${basePriceInEthNum} WETH.`);
        return;
      }
    }
    try {
      setIsSubmitting(true);
      const seaport = getOpenSeaport();
      seaport
        .createBuyOrder({
          asset: {
            tokenAddress: data.tokenAddress!,
            tokenId: data.tokenId!,
            schemaName: data?.schemaName // getSchemaName(data.tokenAddress!)
          },
          accountAddress: user!.account,
          startAmount: offerPrice,
          assetDetails: data,
          expirationTime: expiryTimeSeconds
        })
        .then(() => {
          showAppMessage('Offer sent successfully.');
          setIsSubmitting(false);
          onComplete();
        })
        .catch((err: GenericError) => {
          setIsSubmitting(false);
          console.error('ERROR:', err);
          showAppError(err?.message);
        });
    } catch (err) {
      setIsSubmitting(false);
      showAppError((err as GenericError)?.message);
    }
  };

  return (
    <div>
      <Title text="Make an offer on this NFT" />

      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          makeAnOffer();
        }}
      >
        {token === 'WETH' && (
          <div className={styles.priceRow}>
            <Label text="Minimum Price" />

            <div style={{ flex: 1 }} />
            <PriceBox justifyRight price={data.price} token={token} expirationTime={data?.expirationTime} />
          </div>
        )}

        <div className={styles.col}>
          <Label text="Enter offer" className={styles.colTitle} />

          <Input
            className={styles.offerBorder}
            required
            placeholder="WETH" // {token}
            type="number"
            step={0.000000001}
            onChange={(ev) => setOfferPrice(parseFloat(ev.target.value))}
          />
        </div>
        <div className={styles.col}>
          <Label text="Expiry date" className={styles.colTitle} />

          <DatePicker
            placeholder="Optional"
            value={expiryDate}
            onChange={(date) => {
              setExpiryDate(date);
              setExpiryTimeSeconds(Math.round((date || Date.now()).valueOf() / 1000));
            }}
          />
        </div>

        <div className={styles.wideButton}>
          <Button type="submit" loadingText="Making Offer" isLoading={isSubmitting} spinnerPlacement="end">
            Make an Offer
          </Button>
        </div>
      </form>
    </div>
  );
};
