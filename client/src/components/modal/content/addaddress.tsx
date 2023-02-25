import styles from '@/styles/componentstyles/adduseraddress.module.scss';
import { useState } from 'react';
import { phone } from 'phone';
import { CREATE_NEW_ADDRESS_MUTATION, GRAPHQLAPI } from '@/util/constant';
import { useSessionStorage } from 'usehooks-ts';
import axios from 'axios';

interface Parameter {
  refreshComponent: Function;
  handleCloseModal: Function;
}
export default function AddUserAddress(props: Parameter) {
  const [token, setToken] = useSessionStorage('token', '');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [detail, setDetail] = useState('');
  const [defaultAddress, setDefaultAddress] = useState(false);
  const [error, setError] = useState('');

  const handleSaveButton = () => {
    validateFields();
  };

  const validateFields = () => {
    if (
      firstName == '' ||
      lastName == '' ||
      region == '' ||
      city == '' ||
      zipCode == '' ||
      phoneNumber == '' ||
      detail == ''
    ) {
      setError('All Fields must be Filled !');
      return;
    } else if (!phone(phoneNumber).isValid) {
      setError('Invalid Phone Number !');
      return;
    }

    axios
      .post(
        GRAPHQLAPI,
        {
          query: CREATE_NEW_ADDRESS_MUTATION,
          variables: {
            name: firstName + ' ' + lastName,
            isPrimary: defaultAddress,
            region: region,
            city: city,
            zipCode: zipCode,
            phone: phoneNumber,
            detail: detail,
          },
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((res) => {
        console.log('Success bor');
        props.refreshComponent();
        props.handleCloseModal();
      })
      .catch((error) => {
        setError('Unable to create address ! Please try again...');
      });
  };

  return (
    <div className={styles.contentcontainer}>
      <div className={styles.halfinputcontainer}>
        <div style={{ width: '50%' }}>
          <span style={{ display: 'block', marginBottom: '10px' }}>
            First Name
          </span>
          <input
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            style={{ width: '95%' }}
            type="text"
            className={styles.defaultinput}
            placeholder="First Name"
          />
        </div>

        <div style={{ width: '50%' }}>
          <span style={{ display: 'block', marginBottom: '10px' }}>
            Last Name
          </span>
          <input
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
            }}
            style={{ width: '95%' }}
            type="text"
            className={styles.defaultinput}
            placeholder="Last Name"
          />
        </div>
      </div>
      <div className={styles.regioninputcontainer}>
        <span style={{ display: 'block', marginBottom: '10px' }}>
          Region / Country
        </span>
        <input
          value={region}
          onChange={(e) => {
            setRegion(e.target.value);
          }}
          style={{ width: '95%' }}
          type="text"
          className={styles.defaultinput}
          placeholder="Region / Country"
        />
      </div>
      <div style={{ width: '100%' }}>
        <span style={{ display: 'block', marginBottom: '10px' }}>Detail</span>
        <input
          value={detail}
          onChange={(e) => {
            setDetail(e.target.value);
          }}
          style={{ width: '95%' }}
          type="text"
          className={styles.defaultinput}
          placeholder="Address Detail"
        />
      </div>

      <div className={styles.halfinputcontainer}>
        <div style={{ width: '50%' }}>
          <span style={{ display: 'block', marginBottom: '10px' }}>City</span>
          <input
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
            }}
            style={{ width: '95%' }}
            type="text"
            className={styles.defaultinput}
            placeholder="City"
          />
        </div>

        <div style={{ width: '50%' }}>
          <span style={{ display: 'block', marginBottom: '10px' }}>
            Zip Code
          </span>
          <input
            value={zipCode}
            onChange={(e) => {
              setZipCode(e.target.value);
            }}
            style={{ width: '95%' }}
            type="text"
            className={styles.defaultinput}
            placeholder="Zip Code"
          />
        </div>
      </div>
      <div className={styles.halfinputcontainer}>
        <div style={{ width: '50%' }}>
          <span style={{ display: 'block', marginBottom: '10px' }}>Phone</span>
          <input
            value={phoneNumber}
            onChange={(e) => {
              setPhoneNumber(e.target.value);
            }}
            style={{ width: '95%' }}
            type="text"
            className={styles.defaultinput}
            placeholder="Phone"
          />
        </div>
      </div>
      <div style={{ width: '50%' }}>
        <label htmlFor="">
          <input
            type="checkbox"
            checked={defaultAddress}
            onChange={(e) => {
              setDefaultAddress(e.target.checked);
            }}
          />
          <span style={{ fontSize: '16px' }}>Set Default Address</span>
        </label>
      </div>

      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            color: 'red',
          }}
        >
          {error}
        </span>
        <button onClick={handleSaveButton}>Save</button>
      </div>
    </div>
  );
}
