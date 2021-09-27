import React from 'react';
import styles from './LeaderBoardTable.module.scss';
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { ellipsisAddress, numStr } from 'utils/commonUtil';
import { LeaderBoard } from 'types/rewardTypes';

type Props = {
  data?: LeaderBoard;
};

export const LeaderBoardTable = ({ data }: Props) => {
  if (!data) {
    return <div>Nothing found</div>;
  }

  const rows = data.results.map((item, index) => {
    return (
      <Tr key={item.id}>
        <Td textAlign="left" isNumeric={false}>
          #{index + 1}
        </Td>
        <Td textAlign="left" isNumeric={false}>
          {ellipsisAddress(item.id)}
        </Td>
        <Td textAlign="center" isNumeric={false}>
          {numStr(item.numListings)}
        </Td>
        <Td textAlign="center" isNumeric={false}>
          {numStr((item.numPurchases ?? 0) + (item.numSales ?? 0))}
        </Td>
        <Td textAlign="center" isNumeric={false}>
          {numStr(item.numOffers)}
        </Td>

        <Td textAlign="right" isNumeric={false}>
          {numStr(item.rewardsInfo.netRewardNumeric)}
        </Td>
      </Tr>
    );
  });

  return (
    <div className={styles.main}>
      <Table colorScheme="gray">
        <Thead>
          <Tr>
            <Th textAlign="left">Rank</Th>
            <Th textAlign="left">Address</Th>
            <Th>Listings</Th>
            <Th>Purchases / Sales</Th>
            <Th>Offers</Th>
            <Th textAlign="right">Rewards</Th>
          </Tr>
        </Thead>
        <Tbody>{rows}</Tbody>
      </Table>
    </div>
  );
};
