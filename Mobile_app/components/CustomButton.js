import { StyleSheet, Pressable } from "react-native";

const CustomButton = ({ children, style, onPress }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        {
          ...style,
          ...styles.Button,
          opacity: pressed ? 0.5 : 1,
        },
      ]}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  Button: {
    borderRadius: 30,
  },
});

export default CustomButton;
