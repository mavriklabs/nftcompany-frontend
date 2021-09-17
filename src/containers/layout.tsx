import React from 'react';
import { FilterContext, FilterContextProvider } from '../hooks/useSearch';
import { AppContextProvider } from 'utils/context/AppContext';
import { AppChakraProvider } from 'utils/themeUtil';

import Header from './header';
import LandingHeader from './LandingHeader';
import LandingFooter from './footer';

interface IProps {
  children: any;
  landing?: boolean;
}

const Layout: React.FC<IProps> = ({ landing, children }: IProps) => {
  const [filter, setFilter] = React.useState<any>({ search: '' });
  return (
    <>
      <AppChakraProvider>
        <AppContextProvider>
          <FilterContextProvider>
            <FilterContext.Provider value={{ filter, setFilter }}>
              {(landing && <LandingHeader />) || <Header />}
              <main>{children}</main>
              {landing && <LandingFooter />}
            </FilterContext.Provider>
          </FilterContextProvider>
        </AppContextProvider>
      </AppChakraProvider>
    </>
  );
};

export default Layout;
