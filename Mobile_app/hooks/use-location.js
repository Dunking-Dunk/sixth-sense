import * as Location from "expo-location";

class GetUserLocation {
  constructor() {
    this.TASK_NAME = "BACKGROUND_LOCATION_TASK";
    this.getPermissions();
    // this.defineTask();
  }

  async getPermissions() {
    let foregroundPermission =
      await Location.requestForegroundPermissionsAsync();

    if (!foregroundPermission.granted) {
      this.error = "Permission to access location was denied";
      showError("Permission to access location was denied");
    }
  }

  async getUserLocation(setLocation) {
    const location = await Location.getCurrentPositionAsync({
      accuracy: 2,
    });
    setLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude })
    
    setInterval(async () => {
      const location = await Location.getCurrentPositionAsync({
        accuracy: 2,
      });
    setLocation({latitude: location.coords.latitude, longitude: location.coords.longitude})
    }, 10000);
  }

  // defineTask() {
  //   TaskManager.defineTask(this.TASK_NAME, async ({ data, error }) => {
  //     if (error) {
  //       this.error = error;
  //       return;
  //     }
  //     if (data) {
  //       const { locations } = data;
  //       const location = locations[0];

  //       if (location) {
  //         this.dispatch(getUserLocation(location));
  //       }
  //     }
  //   });
  // }

  // getUserLocationBackground() {
  //   Location.startLocationUpdatesAsync(this.TASK_NAME, {
  //     // The following notification options will help keep tracking consistent
  //     showsBackgroundLocationIndicator: true,
  //     distanceInterval: 5,
  //     deferredUpdatesInterval: 5000,
  //     accuracy: Location.Accuracy.Highest,
  //     foregroundService: {
  //       notificationTitle: "Location",
  //       notificationBody: "Location tracking in background",
  //       notificationColor: "#fff",
  //     },
  //   });
  // }
}

export default GetUserLocation;
