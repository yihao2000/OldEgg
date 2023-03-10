import useGeolocation from 'react-hook-geolocation';
import { Location, User } from '../interfaces/interfaces';
import styles from '@/styles/home.module.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  CURRENT_USER_QUERY,
  GRAPHQLAPI,
  LOCATIONS_QUERY,
  USER_LOCATION_QUERY,
} from '@/util/constant';
import { useSessionStorage } from 'usehooks-ts';

export default function LocationCard() {
  const [selectedLocation, setSelectedLocation] = useState<Location>();
  const [locations, setLocations] = useState<Location[]>();
  const [token, setToken] = useSessionStorage('token', '');
  const [user, setUser] = useState<User>();
  const geolocation = useGeolocation({
    enableHighAccuracy: true,
    maximumAge: 15000,
    timeout: 12000,
  });

  useEffect(() => {
    axios
      .post(GRAPHQLAPI, {
        query: LOCATIONS_QUERY,
      })
      .then((res) => {
        setLocations(res.data.data.locations);
      })

      .catch((err) => console.log(err));

    axios
      .post(
        GRAPHQLAPI,
        {
          query: CURRENT_USER_QUERY,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((res) => {
        if (res.data.data.getCurrentUser) {
          setUser(res.data.data.getCurrentUser);
        }
      })

      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (user && locations && geolocation) {
      axios
        .post(
          GRAPHQLAPI,
          {
            query: USER_LOCATION_QUERY,
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then((res) => {
          if (res.data.data.getUserLocation.id == '') {
            var tempLocations = locations;

            const closest = tempLocations.reduce((a, b) => {
              return Math.abs(
                Math.abs(b.longitude) +
                  Math.abs(b.latitude) -
                  (Math.abs(geolocation.longitude) +
                    Math.abs(geolocation.latitude)),
              ) <
                Math.abs(
                  Math.abs(a.longitude) +
                    Math.abs(a.latitude) -
                    (Math.abs(geolocation.longitude) +
                      Math.abs(geolocation.latitude)),
                )
                ? b
                : a;
            });
            setSelectedLocation(closest);
          } else {
            setSelectedLocation(res.data.data.getUserLocation);
          }
        })

        .catch((err) => console.log(err));
    }
  }, [locations, geolocation]);

  return (
    <div className={styles.locationcard}>
      <div>
        {' '}
        <div className={styles.locationtitle}>Current Location: </div>
        <div className={styles.locationcontent}>{selectedLocation?.name}</div>
      </div>
    </div>
  );
}
