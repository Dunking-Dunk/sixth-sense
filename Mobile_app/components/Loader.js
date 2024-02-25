import { View } from "react-native";
import LottieView from 'lottie-react-native';

const Loader = () => {
    return (
        <LottieView
        autoPlay
              style={{
            flex: 1 
        }}
        source={require('../assets/lottie/Loader.json')}
      />
    )
}

export default Loader