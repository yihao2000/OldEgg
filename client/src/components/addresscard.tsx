import styles from '@/styles/componentstyles/addresscard.module.scss';
import { Address } from './interfaces/interfaces';

interface Parameter {
  address: Address;
  refreshComponent: Function;
}
export default function AddressCard(props: Parameter) {
  return (
    <div className={styles.addresscardouter}>
      <div className={styles.selectedcontainer}>
        <input type="checkbox" />
      </div>
      <div className={styles.informationcontainer}>
        <div className={styles.addressname}>{props.address.name}</div>
        <div className={styles.addresscity}>{props.address.city}</div>
        <div className={styles.addresscontainer}>
          <div className={styles.addressdetailcontainer}>
            {props.address.detail}
          </div>
          <div className={styles.addressdetailcontainer}>
            {props.address.region}
          </div>
        </div>
        <div className={styles.addressphone}>{props.address.phone}</div>
      </div>
    </div>
  );
}
