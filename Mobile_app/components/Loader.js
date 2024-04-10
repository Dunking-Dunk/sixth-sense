import { View } from "react-native";
import LottieView from 'lottie-react-native';

const Loader = ({style}) => {
    return (
        <LottieView
        autoPlay
              style={{
            flex: 1 ,
            ...style
        }}
        source={require('../assets/lottie/Loader.json')}
      />
    )
}

export default Loader