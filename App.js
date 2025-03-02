import { StyleSheet, View, Text, TextInput, Animated, TouchableOpacity } from "react-native";
import { useState, useRef } from "react";
import axios from 'axios';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [headline, setHeadline] = useState("Create Account");
  const [forgotText, setForgotText] = useState("Already Have?");
  const [buttonText, setButtonText] = useState("SIGN UP");
  const [showPassword, setShowPassword] = useState(false);
  const [eyeColor, setEyeColor] = useState("gray");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupBackground, setPopupBackground] = useState("#28a745");

  const forgotAnim = useRef(new Animated.Value(0)).current;
  const headlineOpacityAnim = useRef(new Animated.Value(1)).current;
  const miniTextOpacityAnim = useRef(new Animated.Value(0)).current;
  const popupAnim = useRef(new Animated.Value(0)).current;

  const validateForm = () => {
    let errors = {};
    if (!username) errors.username = "Username is required";
    if (!password) errors.password = "Password is required";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const showPopup = (message, isError = false) => {
    setPopupMessage(message);
    setPopupBackground(isError ? "#dc3545" : "#28a745");
    setPopupVisible(true);
    Animated.timing(popupAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();


    setTimeout(() => {
      Animated.timing(popupAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setPopupVisible(false);
      });
    }, 3000);
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const url = buttonText === 'SIGN UP' ? 'http://localhost:3000/api/signup' : 'http://localhost:3000/api/login';
        const response = await axios.post(url, {
          email: username,
          password: password,
        });

        if (buttonText === 'SIGN UP') {
          showPopup("Signup successful!");
        } else {
          showPopup("Signin successful!");
        }

        setUsername("");
        setPassword("");
        setErrors({});
      } catch (error) {
        if (error.response) {
          const errorMessage = error.response.data.message;
          showPopup(errorMessage, true);
        } else {
          showPopup("An error occurred. Please try again.", true);
        }
      }
    }
  };

  const animateText = () => {
    Animated.timing(forgotAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setForgotText("Forgot Password?");
    });

    Animated.timing(headlineOpacityAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setHeadline("Welcome");

      Animated.timing(headlineOpacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });

    Animated.timing(miniTextOpacityAnim, {
      toValue: 1,
      duration: 2500,
      useNativeDriver: true,
    }).start();

    setButtonText("SIGN IN");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setEyeColor(showPassword ? "gray" : "black");
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Animated.Text
          style={[
            styles.headline,
            { opacity: headlineOpacityAnim },
            buttonText === "SIGN IN" ? { marginBottom: 0 } : { marginBottom: 30 },
          ]}
        >
          {headline}
        </Animated.Text>

        {buttonText === "SIGN IN" && (
          <Animated.Text style={[styles.miniText, { opacity: miniTextOpacityAnim }]}>
            Please enter your details to sign in.
          </Animated.Text>
        )}

        <TextInput style={styles.input} placeholder="Email" value={username} onChangeText={setUsername} />
        {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Icon name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color={eyeColor} />
          </TouchableOpacity>
        </View>
        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

        <TouchableOpacity onPress={animateText}>
          <Animated.Text style={[styles.blueText, { transform: [{ translateX: forgotAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 200],
          }) }] }]}>
            {forgotText}
          </Animated.Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>


      {popupVisible && (
        <Animated.View style={[styles.popup, { opacity: popupAnim, backgroundColor: popupBackground }]}>
          <Text style={styles.popupText}>{popupMessage}</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  form: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  headline: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  miniText: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginBottom: 10,
  },
  input: {
    height: 35,
    backgroundColor: "#e1e1e1",
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e1e1e1",
    borderRadius: 8,
    height: 35,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  passwordInput: {
    flex: 1,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  blueText: {
    color: "black",
    fontSize: 12,
    marginLeft: 3,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: 'black',
    borderRadius: 8,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  popup: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#28a745',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    zIndex: 9999,
  },
  popupText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
