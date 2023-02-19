import styles from '@/styles/componentstyles/modal.module.scss';
import { ReactNode } from 'react';
import { FaTimes } from 'react-icons/fa';

type Props = {
  children: ReactNode;
  closeModal: Function;
  width: number;
  height: number;
};
export default function Modal(props: Props) {
  const handleCloseButtonClick = () => {
    props.closeModal();
  };
  return (
    <div className={styles.modalbackground}>
      <div
        className={styles.modalcontainer}
        style={{
          width: '30vw',
        }}
      >
        <div style={{ width: '100%', position: 'relative', height: '25px' }}>
          {' '}
          <FaTimes
            className={styles.closebutton}
            onClick={handleCloseButtonClick}
          />
        </div>
        {props.children}
      </div>
    </div>
  );
}
