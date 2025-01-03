import { doc, setDoc } from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { db } from "../boot/firebase";

const auth = getAuth();

export const register = async (formData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    );
    const user = userCredential.user;

    // Update user profile with display name
    await updateProfile(user, {
      displayName: `${formData.firstName} ${formData.lastName}`,
    });

    // Create initial profile in Firestore
    await setDoc(doc(db, "profiles", user.uid), {
      userId: user.uid,
      username: formData.username,
      fullName: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      role: "member", // Default role
      communityIds: [], // Empty array, updated by store
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return user;
  } catch (error) {
    console.error("Registration error:", error.message);
    throw new Error("Unable to register. Please try again.");
  }
};

export const login = async (formData) => {
  try {
    await signInWithEmailAndPassword(auth, formData.email, formData.password);
    return null; // Successful login
  } catch (error) {
    const errorMessage = mapFirebaseErrorToMessage(error.code);
    console.error("Login error:", error.message);
    throw new Error(errorMessage);
  }
};

const mapFirebaseErrorToMessage = (errorCode) => {
  const errorMessages = {
    "auth/user-not-found": "User not found. Please check your email.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/too-many-requests":
      "Too many failed login attempts. Please try again later.",
  };
  return (
    errorMessages[errorCode] ||
    "An unexpected error occurred. Please try again."
  );
};
