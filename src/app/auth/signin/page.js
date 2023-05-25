'use client'
import { db } from "firebase.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const router = useRouter();
  const onGoogleSignIn = async () => {
    try {
      const auth = getAuth(); // get the auth instance
      const provider = new GoogleAuthProvider(); // create a new provider
      await signInWithPopup(auth, provider); // sign in with the provider
      const user = auth.currentUser.providerData[0]; // get the user data
      console.log("User", user);
      // get the user document
      const docRef = doc(db, "users", user?.uid || "");
      // get the user document snapshot with handle errors
      const docSnap = await getDoc(docRef).catch((err) => {
        console.log("Error getting document", err);
      });

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          avatar: user.photoURL,
          username: user.email.split("@")[0],
          uid: user.uid,
          timestamp: serverTimestamp(),
        });
      }else{
        console.log("Document data:", docSnap.data());
      }
      router.push("/");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="flex justify-center mt-20 space-x-4">
      <img
        src="https://cdn.cms-twdigitalassets.com/content/dam/help-twitter/en/twitter-tips/desktop-assets/ch-01/ch12findphone.png.twimg.1920.png"
        alt="twitter image inside a phone"
        className="hidden object-cover md:w-44 md:h-80 rotate-6  md:inline-flex"
      />

      <div className="">
        <div className="flex flex-col items-center">
          <img
            className="w-36 object-cover"
            src="https://help.twitter.com/content/dam/help-twitter/brand/logo.png"
            alt="twitter logo"
          />
          <p className="text-center text-sm italic my-10">
            This app is created for learning purposes
          </p>
          <button
            onClick={onGoogleSignIn}
            className="bg-red-400 rounded-lg p-3 text-white hover:bg-red-500"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}

// export async function getServerSideProps(context) {
//     const providers = await getProviders();
//     console.log(providers)
//     return {
//         props: { providers },
//     };
// }
