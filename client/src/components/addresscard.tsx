import styles from '@/styles/componentstyles/addresscard.module.scss';
import { DELETE_USER_ADDRESS, GRAPHQLAPI } from '@/util/constant';
import axios from 'axios';

import { useEffect } from 'react';
import { useSessionStorage } from 'usehooks-ts';
import { Address } from './interfaces/interfaces';

interface Parameter {
  address: Address;
  refreshComponent: Function;
  selectedAddress: Address | null;
  setSelectedAddress: Function;
}
export default function AddressCard(props: Parameter) {
  const [token, setToken] = useSessionStorage('token', '');
  const handleRemoveClick = () => {
    axios
      .post(
        GRAPHQLAPI,
        {
          query: DELETE_USER_ADDRESS,
          variables: {
            addressID: props.address.id,
          },
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((res) => {
        props.refreshComponent();
      })
      .catch((error) => {});
  };

  useEffect(() => {
    console.log(props.address.isPrimary);
  }, []);
  return (
    <div className={styles.addresscardouter}>
      <div className={styles.selectedcontainer}>
        <input
          type="checkbox"
          checked={props.selectedAddress?.id == props.address.id}
          onChange={() => {
            props.setSelectedAddress(props.address);
          }}
        />
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
        <div>
          {props.address.isPrimary && (
            <div
              style={{
                background: 'red',
                padding: '5px',
                width: 'fit-content',
              }}
            >
              Primary
            </div>
          )}
        </div>
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button className={styles.removebutton} onClick={handleRemoveClick}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
