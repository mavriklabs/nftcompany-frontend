import React, { useState } from 'react';
import styles from './AcceptOfferModal.module.scss';
import { CardData } from 'types/Nft.interface';
import { getOpenSeaport } from 'utils/ethersUtil';
import { apiPost } from 'utils/apiUtil';
import { useAppContext } from 'utils/context/AppContext';
import { GenericError } from 'types';
import ModalDialog from 'components/ModalDialog/ModalDialog';
import { Button } from '@chakra-ui/react';

const isServer = typeof window === 'undefined';

interface IProps {
  data: CardData;
  onClose: () => void;
}

const AcceptOfferModal: React.FC<IProps> = ({ onClose, data }: IProps) => {
  const { user, showAppError } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const acceptOffer = async () => {
    setIsSubmitting(true);

    try {
      const seaport = getOpenSeaport();
      const order = await seaport.api.getOrder({
        maker: data.maker,
        id: data.id,
        side: 0 // buy order
      });

      // Important to check if the order is still available as it can have already been fulfilled by
      // another user or cancelled by the creator
      if (order) {
        const { txnHash, salePriceInEth, feesInEth } = await seaport.fulfillOrder({
          order: order,
          accountAddress: user?.account
        });
        console.log(
          'Accept offer txn hash: ' + txnHash + ' salePriceInEth: ' + salePriceInEth + ' feesInEth: ' + feesInEth
        );
        const payload = {
          actionType: 'fulfill',
          txnHash,
          side: 0,
          orderId: data.id,
          maker: data.maker,
          salePriceInEth: +salePriceInEth,
          feesInEth: +feesInEth
        };
        const { error } = await apiPost(`/u/${user?.account}/wyvern/v1/txns`, {}, payload);
        if (error) {
          showAppError((error as GenericError)?.message);
        } else {
          onClose();
        }
      } else {
        // Handle when the order does not exist anymore
        showAppError('Offer no longer exists.');
      }
    } catch (err) {
      showAppError((err as GenericError)?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {!isServer && (
        <ModalDialog onClose={onClose}>
          <div>
            <div className={styles.title}>Accept Offer</div>

            <div className={styles.space}>You are about to sell this NFT.</div>

            <div className={styles.row}>
              <ul>
                <li>
                  <div>Price</div>
                  <div>
                    <span>{data.metadata?.basePriceInEth}</span>
                  </div>
                  <div>ETH</div> {/* todo: adi polymain; do not remove this comment */}
                </li>
              </ul>
            </div>

            <div className={styles.buttons}>
              <Button onClick={acceptOffer} disabled={isSubmitting}>
                Accept Offer
              </Button>
              <Button colorScheme="gray" disabled={isSubmitting} onClick={() => onClose && onClose()}>
                Cancel
              </Button>
            </div>
          </div>
        </ModalDialog>
      )}
    </>
  );
};

export default AcceptOfferModal;
