import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import {
  Box,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Heading,
  IconButton,
  Stack,
  useMediaQuery,
  Text,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  ModalHeader
} from '@chakra-ui/react';
import ModalDialog from 'components/ModalDialog/ModalDialog';
import { SecondaryOrderBy } from 'hooks/useTrendingStats';
import { useAppContext } from 'utils/context/AppContext';
import { DataColumnGroup, DataColumns } from '../../../pages/trending';

interface Props {
  dataColumns: DataColumns;
  toggleDataColumn: (group: DataColumnGroup, column: SecondaryOrderBy) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

function DiscoverSelectionModal(props: Props) {
  return (
    <ModalDialog onClose={props.onClose}>
      <Box display="flex" flexDirection={'column'}>
        <Text size="2xl" variant="bold" paddingBottom={'8px'}>
          Categories
        </Text>
        <Text size="lg" fontWeight={400}>
          Select up to <b>5</b> categories to be displayed.
        </Text>
      </Box>
      {/* </ModalHeader> */}
      <Box paddingY="42.5px">
        <Stack spacing={2} direction="column">
          {Object.entries(props.dataColumns).map(([groupKey, group]) => {
            return (
              <>
                {Object.entries(group).map(([itemKey, item]) => {
                  return (
                    <Checkbox
                      key={itemKey}
                      isChecked={item.isSelected}
                      disabled={item.isDisabled}
                      onChange={() => {
                        props.toggleDataColumn(groupKey as DataColumnGroup, itemKey as SecondaryOrderBy);
                      }}
                    >
                      {item.name}
                    </Checkbox>
                  );
                })}
              </>
            );
          })}
        </Stack>
      </Box>
      <Box display="flex" flexDirection="row" justifyContent="flex-start">
        <Button
          marginRight={'8px'}
          onClick={() => {
            throw new Error('not yet implemented');
          }}
        >
          Apply
        </Button>
        <Button marginLeft={'8px'} variant={'outline'} onClick={props.onClose}>
          Cancel
        </Button>
      </Box>
    </ModalDialog>
  );
}

export default DiscoverSelectionModal;
