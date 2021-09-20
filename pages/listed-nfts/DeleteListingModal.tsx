import React from 'react';
import styles from './DeleteListingModal.module.scss';
import ModalDialog from 'hooks/ModalDialog';

const isServer = typeof window === 'undefined';

interface IProps {
  user?: any;
  data?: any;
  onSubmit?: () => void;
  onClose: () => void;
}

const DeleteListingModal: React.FC<IProps> = ({ user, data, onSubmit, onClose }: IProps) => {
  React.useEffect(() => {
    // TBD
  }, []);

  return (
    <>
      {!isServer && (
        <ModalDialog onClose={onClose}>
          <div className={`modal ${'ntfmodal'}`} style={{ background: 'white', borderColor: 'white' }}>
            <div className="modal-body">
              <div className={styles.title}>&nbsp;</div>

              <div className={styles.row}>Confirm cancel this listing?</div>

              <div className={styles.footer}>
                <a
                  className="action-btn"
                  onClick={async () => {
                    onSubmit && onSubmit();
                  }}
                >
                  &nbsp;&nbsp;&nbsp; Confirm &nbsp;&nbsp;&nbsp;
                </a>

                <a className="action-btn action-2nd" onClick={() => onClose && onClose()}>
                  Cancel
                </a>
              </div>
            </div>
          </div>
        </ModalDialog>
      )}
    </>
  );
};

export default DeleteListingModal;
