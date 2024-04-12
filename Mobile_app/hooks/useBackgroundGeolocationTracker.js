import {useEffect, useState} from 'react';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import Boundary, {Events} from 'react-native-boundary';
import {Platform, Alert} from 'react-native';

const useBackgroundGeolocationTracker = () => {
  const [state, setState] = useState({
    region: null,
    latitude: null,
    longitude: null,
    isEnter: false,
  });
  const longitudeDelta = 0.01;
  const latitudeDelta = 0.01;

  useEffect(() => {
    // Configs
    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 50,
      distanceFilter: 50,
      notificationTitle: 'Background tracking',
      notificationText: 'enabled',
      debug: false,
      startOnBoot: false,
      stopOnTerminate: false,
      locationProvider:
        Platform.OS === 'android'
          ? BackgroundGeolocation.ACTIVITY_PROVIDER
          : BackgroundGeolocation.DISTANCE_FILTER_PROVIDER,
      interval: 10000,
      fastestInterval: 10000,
      activitiesInterval: 10000,
      stopOnStillActivity: false,
      url: 'http://192.168.0.97:3000/locations',
      syncUrl: 'http://192.168.0.97:3000/sync',
      httpHeaders: {
        'X-FOO': 'bar',
      },
      // customize post properties
      postTemplate: {
        lat: '@latitude',
        lon: '@longitude',
      },
    });

    // Onchange
    BackgroundGeolocation.on('location', (location) => {
      console.log('[DEBUG] BackgroundGeolocation location', location);

      BackgroundGeolocation.startTask((taskKey) => {
        const region = Object.assign({}, location, {
          latitudeDelta,
          longitudeDelta,
        });

        setState((state) => ({
          ...state,
          latitude: location.latitude,
          longitude: location.longitude,
          region: region,
        }));

        BackgroundGeolocation.endTask(taskKey);
      });
    });

    // On Start
    BackgroundGeolocation.on('start', () => {
      console.log('[INFO] BackgroundGeolocation service has been started');

      BackgroundGeolocation.getCurrentLocation(
        (location) => {
          const region = Object.assign({}, location, {
            latitudeDelta,
            longitudeDelta,
          });
          setState((state) => ({
            ...state,
            latitude: location.latitude,
            longitude: location.longitude,
            region: region,
          }));
        },
        (error) => {
          setTimeout(() => {
            Alert.alert(
              'Error obtaining current location',
              JSON.stringify(error),
            );
          }, 100);
        },
      );
    });

    BackgroundGeolocation.checkStatus((status) => {
      console.log(
        '[INFO] BackgroundGeolocation service is running',
        status.isRunning,
      );
      console.log(
        '[INFO] BackgroundGeolocation services enabled',
        status.locationServicesEnabled,
      );
      console.log(
        '[INFO] BackgroundGeolocation auth status: ' + status.authorization,
      );

      // you don't need to check status before start (this is just the example)
      // if (!status.isRunning) {
      BackgroundGeolocation.start(); //triggers start on start event
      // }
    });

    BackgroundGeolocation.on('background', () => {
      console.log('[INFO] App is in background');
    });

    BackgroundGeolocation.on('foreground', () => {
      console.log('[INFO] App is in foreground');
    });

    BackgroundGeolocation.on('stationary', (location) => {
      console.log('[DEBUG] BackgroundGeolocation stationary', location);
    });

    return () => {
      BackgroundGeolocation.events.forEach((event) =>
        BackgroundGeolocation.removeAllListeners(event),
      );
      Boundary.removeAll();
    };
  }, []);

  return state;
};

export default useBackgroundGeolocationTracker;