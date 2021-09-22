import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import CardList from 'components/Card/CardList';
import { apiGet, apiDelete } from 'utils/apiUtil';
import { ITEMS_PER_PAGE } from 'utils/constants';
import { FetchMore, getLastItemCreatedAt, NoData } from 'components/FetchMore/FetchMore';
import { useAppContext } from 'utils/context/AppContext';
import styles from '../../styles/Dashboard.module.scss';
import { ordersToCardData } from 'services/Listings.service';
import LoadingCardList from 'components/LoadingCardList/LoadingCardList';

export default function OffersMade() {
  const { user, showAppError } = useAppContext();
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(-1);
  const [dataLoaded, setDataLoaded] = useState(false);

  const fetchData = async () => {
    if (!user?.account) {
      setData([]);
      return;
    }
    setIsFetching(true);
    let listingData = [];
    const newCurrentPage = currentPage + 1;
    try {
      const { result, error } = await apiGet(`/u/${user?.account}/offersmade`, {
        startAfter: getLastItemCreatedAt(data),
        limit: ITEMS_PER_PAGE
      });
      if (error) {
        showAppError(`${error?.message}`);
        return;
      }
      listingData = result?.listings || [];
    } catch (e) {
      console.error(e);
    }
    const moreData = ordersToCardData(listingData || []);
    setIsFetching(false);
    setData([...data, ...moreData]);
    setCurrentPage(newCurrentPage);
  };

  React.useEffect(() => {
    console.log('- Offers Made - user:', user);
    fetchData();
  }, [user]);

  React.useEffect(() => {
    if (currentPage < 0 || data.length < currentPage * ITEMS_PER_PAGE) {
      return;
    }
    setDataLoaded(true); // current page's data loaded & rendered.
  }, [currentPage]);
  return (
    <>
      <Head>
        <title>Offers Made</title>
      </Head>
      <div className={styles.dashboard}>
        <div className="page-container">
          <div className="section-bar">
            <div className="tg-title">Offers Made</div>
          </div>

          <div className={styles.main}>
            <NoData dataLoaded={dataLoaded} isFetching={isFetching} data={data} />
            {data?.length === 0 && isFetching && <LoadingCardList />}

            <CardList data={data} action="CANCEL_OFFER" />
          </div>

          {dataLoaded && (
            <FetchMore
              currentPage={currentPage}
              data={data}
              onFetchMore={async () => {
                setDataLoaded(false);
                await fetchData();
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}

// eslint-disable-next-line react/display-name
OffersMade.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
