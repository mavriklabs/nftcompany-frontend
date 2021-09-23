import { CardData } from 'types/Nft.interface';
import { useEffect, useState } from 'react';
import { SearchFilter, useSearchContext } from './useSearch';
import { useAppContext } from 'utils/context/AppContext';
import { ITEMS_PER_PAGE } from 'utils/constants';
import { getListings, TypeAheadOption } from 'services/Listings.service';
import { getLastItemBasePrice, getLastItemCreatedAt } from 'components/FetchMore/FetchMore';

const PAGE_SIZE = 5;

const hashString = (s: string) => s.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);

const fetchData = async (
  filter: SearchFilter,
  startAfterMillis: string,
  startAfterPrice: string,
  collectionName: string,
  typeAhead: TypeAheadOption | undefined
): Promise<CardData[]> => {
  const result = await getListings({
    ...filter,
    startAfterMillis: startAfterMillis,
    startAfterPrice: startAfterPrice,
    limit: PAGE_SIZE.toString(),
    id: typeAhead?.id ?? '',
    tokenAddress: typeAhead?.address ?? '',
    collectionName: collectionName,
    priceMax: collectionName?.length > 0 ? '1000000' : '' // SNG
  });

  return result;
};

export function useCardProvider(): { list: CardData[]; loadNext: () => void; hasData: boolean } {
  const [list, setList] = useState<CardData[]>([]);
  const [listType, setListType] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [hasData, setHasData] = useState(false);

  const searchContext = useSearchContext();
  const { user } = useAppContext();

  const userAccount = user?.account;

  const fetchList = async (newListType: string) => {
    let startAfter = '';
    let startAfterPrice = '';
    let previousList: CardData[] = [];

    // are we getting the next page?
    if (listType === newListType && list?.length > 0) {
      previousList = list;

      startAfter = getLastItemCreatedAt(list);
      startAfterPrice = getLastItemBasePrice(list);
    } else {
      setHasMore(true);
      setHasData(false);

      console.log('fresh list');
    }

    setListType(newListType);

    let result = await fetchData(
      searchContext.filterState,
      startAfter,
      startAfterPrice,
      searchContext.searchState.collectionName,
      searchContext.searchState.selectedOption
    );

    if (result.length < PAGE_SIZE) {
      setHasMore(false);
    }

    // remove any owned by the current user
    if (userAccount && result && result.length > 0) {
      result = result.filter((item) => {
        // opensea lowercases their account strings, so compare to lower
        return item.owner?.toLowerCase() !== userAccount.toLowerCase();
      });
    }

    setList([...previousList, ...result]);
    setHasData(true);
  };

  useEffect(() => {
    const loadData = async () => {
      let hash = searchContext.searchState.collectionName;
      hash += JSON.stringify(searchContext.filterState);
      hash += JSON.stringify(searchContext.searchState.selectedOption);
      hash = hashString(hash).toString();

      if (searchContext.searchState.collectionName) {
        fetchList('collection-name:' + hash);
      } else if (searchContext.searchState.selectedOption) {
        fetchList('selected-option:' + hash);
      } else {
        fetchList('normal' + hash);
      }
    };

    loadData();
  }, [searchContext, userAccount]);

  const loadNext = () => {
    if (hasData && hasMore) {
      console.log('loadNext');
      console.log(listType);

      fetchList(listType);
    } else {
      if (!hasData) {
        console.log('ScrollLoader too early to load next, no data');
      } else {
        console.log('ScrollLoader no more data');
      }
    }
  };

  return { list, loadNext, hasData };
}
