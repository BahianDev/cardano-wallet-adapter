import { capitalize, formatSupportedWallets } from '../../common';
import {
  ConnectWalletListProps,
  ConnectWalletError,
  UnavailableWalletVisibility,
} from '../../global/types';
import { useCardano } from '../../hooks';
import { getWalletIcon, isWalletInstalled } from '../../utils';
import Color from 'color';
import {
  DesktopMenuItem,
  Menu,
  MenuItem,
  MenuItemIcon,
} from './StyledListElements';
import { checkIsMobile, estimateAvailableWallets } from '../../utils/common';

const ConnectWalletList = ({
  supportedWallets = ['Flint', 'Nami', 'Eternl', 'Yoroi'],
  primaryColor,
  borderRadius,
  gap,
  showUnavailableWallets = UnavailableWalletVisibility.SHOW_UNAVAILABLE_ON_MOBILE,
  alwaysVisibleWallets = [],
  customCSS,
  onConnect,
  onConnectError,
}: ConnectWalletListProps) => {
  const { connect, installedExtensions } = useCardano();

  const mobileWallets = ['flint'];
  const isMobile = checkIsMobile();
  const availableWallets = estimateAvailableWallets(
    supportedWallets,
    showUnavailableWallets,
    alwaysVisibleWallets,
    installedExtensions
  );

  const connectWallet = async (walletName: string) => {
    const onSuccess = () => {
      if (typeof onConnect === 'function') {
        onConnect(walletName);
      }
    };

    const onError = (code: ConnectWalletError) => {
      if (typeof onConnectError === 'function') {
        onConnectError(walletName, code);
      } else {
        if (code === ConnectWalletError.WalletExtensionNotFound) {
          const chromeStoreUrl = 'https://chrome.google.com/webstore/detail/';
          if (walletName.toLowerCase() === 'nami') {
            window.open(
              `${chromeStoreUrl}nami/lpfcbjknijpeeillifnkikgncikgfhdo`
            );
          } else if (walletName.toLowerCase() === 'flint') {
            window.open(
              `${chromeStoreUrl}flint-wallet/hnhobjmcibchnmglfbldbfabcgaknlkj`
            );
          } else if (walletName.toLowerCase() === 'typhon') {
            window.open(
              `${chromeStoreUrl}typhon-wallet/kfdniefadaanbjodldohaedphafoffoh`
            );
          } else if (walletName.toLowerCase() === 'yoroi') {
            window.open(
              `${chromeStoreUrl}yoroi/ffnbelfdoeiohenkjibnmadjiehjhajb`
            );
          } else if (walletName.toLowerCase() === 'eternl') {
            window.open(
              `${chromeStoreUrl}eternl/kmhcihpebfmpgmihbkipmjlmmioameka`
            );
          } else if (walletName.toLowerCase() === 'gerowallet') {
            window.open(
              `${chromeStoreUrl}gerowallet/bgpipimickeadkjlklgciifhnalhdjhe`
            );
          } else if (walletName.toLowerCase() === 'nufi') {
            window.open(
              `${chromeStoreUrl}nufi/gpnihlnnodeiiaakbikldcihojploeca`
            );
          } else {
            alert(
              `Please make sure you are using a modern browser and the ${walletName} browser extension has been installed.`
            );
          }
        } else {
          alert(`Something went wrong. Please try again later.`);
        }
      }
    };

    connect(walletName, onSuccess, onError);
  };

  const connectMobileWallet = async (walletName: string) => {
    if (!isMobile) {
      connectWallet(walletName);
    }

    if (!mobileWallets.includes(walletName.toLowerCase())) {
      return;
    }

    if (walletName.toLowerCase() === 'flint') {
      if (isWalletInstalled('flint')) {
        connectWallet(walletName);
      } else {
        window.location.href = `https://flint-wallet.app.link/browse?dappUrl=${encodeURIComponent(
          window.location.href
        )}`;
      }
    }
  };

  const themeColorObject = primaryColor
    ? Color(primaryColor)
    : Color('#0538AF');

  return (
    <Menu customCSS={customCSS}>
      {availableWallets ? (
        availableWallets.map((availableWallet) => {
          if (
            isMobile &&
            !mobileWallets.includes(availableWallet.toLowerCase())
          ) {
            return (
              <DesktopMenuItem
                primaryColor={themeColorObject.hex()}
                primaryColorLight={themeColorObject
                  .mix(Color('white'), 0.9)
                  .hex()}
                borderRadius={borderRadius}
                gap={gap}
                key={availableWallet}
              >
                <MenuItemIcon src={getWalletIcon(availableWallet)} />
                {capitalize(availableWallet)}
                <span>Desktop Only</span>
              </DesktopMenuItem>
            );
          }

          return (
            <MenuItem
              primaryColor={themeColorObject.hex()}
              primaryColorLight={themeColorObject
                .mix(Color('white'), 0.9)
                .hex()}
              borderRadius={borderRadius}
              gap={gap}
              key={availableWallet}
              onClick={() => connectMobileWallet(availableWallet)}
            >
              <MenuItemIcon src={getWalletIcon(availableWallet)}></MenuItemIcon>
              {capitalize(availableWallet)}
            </MenuItem>
          );
        })
      ) : (
        <span>{`Please install a wallet browser extension (${formatSupportedWallets(
          supportedWallets
        )} are supported)`}</span>
      )}
    </Menu>
  );
};

export default ConnectWalletList;
