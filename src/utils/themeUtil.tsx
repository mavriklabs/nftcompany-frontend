import React from 'react';
import { ChakraProvider, theme as baseTheme, extendTheme, ThemeConfig, withDefaultColorScheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

// const brandBlue = '#0000ff'; // #4047ff';
// const brandGray = '#888A8C'; // #4047ff';
const brandBlue = '#4047ff';
const brandGray = '#888A8C';
const darkGray = '#1A202C'; // Gray.800
const darkGrayAlpha = '#1A202Ccc';

const lightBg = '#fcfdfd';
const lightBgAlpha = '#fcfdfdcc';

export const colors = {
  brandBlue: brandBlue,
  brandGray: brandGray,

  // custom colors
  windowBg: lightBg,
  windowBgDark: darkGray,

  cardBgLight: '#f3f3f3',
  cardBgDark: '#111',

  // unsure how to add opacity on a css var so we have these variants for now
  headerBg: lightBgAlpha,
  headerBgDark: darkGrayAlpha,

  brandBlueAlpha: brandBlue + 'aa',
  brandBlueLight: brandBlue + '14',
  brandBlueShadow: brandBlue + '44',

  // http://mcg.mbitson.com/#!?mcgpalette0=%234047ff
  blue: {
    50: '#e8e9ff',
    100: '#c6c8ff',
    200: '#a0a3ff',
    300: '#797eff',
    400: '#5d63ff',
    500: '#4047ff',
    600: '#3a40ff',
    700: '#3237ff',
    800: '#2a2fff',
    900: '#1c20ff',
    A100: '#ffffff',
    A200: '#ffffff',
    A400: '#cdcdff',
    A700: '#b3b4ff',
    contrastDefaultColor: 'light'
  },

  grayish: {
    50: brandGray,
    100: brandGray,
    200: brandGray,
    300: brandGray,
    400: brandGray,
    500: brandGray,
    600: brandGray,
    700: brandGray,
    800: brandGray,
    900: brandGray,
    A100: brandGray,
    A200: brandGray,
    A400: brandGray,
    A700: brandGray
  }
};

const Table = {
  sizes: {
    md: {
      th: {
        px: '6',
        py: '5',
        lineHeight: '4',
        fontSize: 'sm'
      }
    }
  },
  baseStyle: {
    table: {
      // turned this off, it uses an ugly font
      fontVariantNumeric: 'none'
    }
  }
};

const Menu = {
  parts: ['menu', 'item'],
  baseStyle: (props: any) => {
    const { baseStyle } = baseTheme.components.Menu;
    const baseStyles = baseStyle(props);

    const bg = mode('white', baseStyles.list?.bg)(props);
    const textColor = mode('var(--text-primary)', 'white')(props);

    return {
      item: {
        color: textColor,

        _focus: { bg: bg, color: textColor },
        _active: { bg: bg, color: textColor },

        _hover: { bg: 'brandBlue', color: 'white' }
      }
    };
  }
};

const Button = {
  baseStyle: (props: any) => {
    return {
      // default is 1.2 and it makes the text a few pixels too high
      lineHeight: '1.0',
      paddingBottom: '4px', // align button text vertically for Futura font.
      fontWeight: 'normal',
      bg: '#222',
      backgroundColor: '#222',
      _hover: {
        bg: '#555',
        backgroundColor: '#555'
      },
      _active: {
        bg: '#222',
        backgroundColor: '#222'
      }
    };
  },
  variants: {
    outline: (props: any) => {
      return {
        bg: '#fff',
        backgroundColor: '#fff',
        border: '2px solid #222',
        color: '#222'
      };
    },
    ghost: (props: any) => {
      return {
        bg: '#fff',
        backgroundColor: '#fff'
      };
    },
    solid: (props: any) => {
      const { colorScheme, colorMode } = props;

      // prevent chakra changing the button colors when in dark mode
      if (colorMode === 'dark' && colorScheme !== 'gray' && colorScheme !== 'grayish') {
        return {
          bg: brandBlue,
          color: 'white'
        };
      }
    }
  }
};

const Input = {
  baseStyle: (props: any) => {
    return {
      paddingBottom: '4px' // align button text vertically for Futura font.
    };
  },
  variants: {
    outline: (props: any) => {
      return {
        border: '1px solid #222',
        field: {
          paddingBottom: '4px', // align button text vertically for Futura font.
          border: '1px solid',

          // not sure why you have to set this
          borderColor: '#aaa',

          _hover: {
            border: '1px solid #aaa'
          }
        }
      };
    }
  }
};

const Link = {
  baseStyle: (props: any) => {
    return {
      color: '#222'
    };
  },
  variants: {
    underline: {
      textDecoration: 'underline'
    }
  }
};

const config: ThemeConfig = {
  useSystemColorMode: false,
  initialColorMode: 'light'
};

const styles = {
  global: (props: any) => {
    return {
      body: {
        fontFamily:
          'Futura, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans,  Droid Sans, Helvetica Neue, sans-serif',

        color: mode('gray.800', 'whiteAlpha.900')(props),

        // bg: mode('white', 'gray.800')(props)
        bg: mode('windowBg', 'windowBgDark')(props)
      },
      '*::placeholder': {
        color: mode('gray.400', 'whiteAlpha.400')(props)
      },
      '*, *::before, &::after': {
        borderColor: mode('gray.200', 'whiteAlpha.300')(props),
        wordWrap: 'break-word'
      }
    };
  }
};

export const theme = extendTheme(
  {
    config,
    colors,
    styles,
    components: {
      Menu,
      Button,
      Table,
      Input,
      Link,
      Drawer: {
        variants: {
          // custom theme for Filter Drawer to allow scrolling/interaction on the main body.
          alwaysOpen: {
            parts: ['dialog, dialogContainer'],
            dialog: {
              pointerEvents: 'auto'
            },
            dialogContainer: {
              pointerEvents: 'none'
            }
          }
        }
      }
    }
  },
  withDefaultColorScheme({ colorScheme: 'blue' }),
  baseTheme // optional
);

export const AppChakraProvider = ({ children }: { children: any }) => (
  <ChakraProvider theme={theme}>{children}</ChakraProvider>
);
