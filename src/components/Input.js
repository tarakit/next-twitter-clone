import React from "react";
import { EmojiHappy, Photograph, XIcon } from "./icons/Icons";
import { useSession } from "next-auth/react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "firebase.js";
import { signOut, getAuth } from "firebase/auth";
import { useRecoilState } from "recoil";
import { userState } from "../atom/userAtom"; // user atom
import { getDownloadURL, ref, uploadString } from "firebase/storage";

export default function Input() {
  const { data: session } = useSession();
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  const [text, setText] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const filePickerRef = React.useRef(null);
  const auth = getAuth();
  // send post to firebase
  const sendPostToServer = async () => {
    if (loading) {
      return;
    } else {
      setLoading(true);
    }

    try {
      const docRef = await addDoc(collection(db, "posts"), {
        id: currentUser.uid,
        text: text,
        avatar: currentUser.avatar,
        timestamp: serverTimestamp(),
        name: currentUser.name,
        username: currentUser.username,
      });

      // ref to the image file location in firebase storage
      const imageRef = ref(storage, `posts/${docRef.id}/image`);

      // if user select image then upload it to firebase storage
      if (selectedFile) {
        await uploadString(imageRef, selectedFile, "data_url").then(
          async (snapshot) => {
            const downloadURL = await getDownloadURL(imageRef); // get download url of image
            
            // update the post with image url
            await updateDoc(doc(db, "posts", docRef.id), {
              image: downloadURL,
            });
          }
        );
      }

      // reset the state
      setText("");
      setSelectedFile(null);
      setLoading(false);
    } catch (error) {
      console.log("error while sending post to server: ", error);
      
      alert("error while sending post to server");
      setText("");
      setSelectedFile(null);
      setLoading(false);
    }
  };

  // add image to post
  const addImageToPost = (e) => {
    const reader = new FileReader(); // FileReader is a built-in browser API
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]); // convert image to data url
    }

    // when the reader is done reading the file, do this...
    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result); // set selected file
    };
  };

  // sign out
  function onSignOut() {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        setCurrentUser(null);
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  }
  return (
    <>
      {currentUser && (
        <div className="flex  border-b border-gray-200 p-3 space-x-3">
          <img
            onClick={onSignOut}
            src={currentUser?.avatar}
            alt="user-profile"
            className="h-11 w-11 rounded-full cursor-pointer hover:brightness-95 object-cover"
          />
          <div className="w-full divide-y divide-gray-200">
            <div className="">
              <textarea
                className="w-full border-none focus:ring-0 text-lg placeholder-gray-700 tracking-wide min-h-[50px] text-gray-700"
                rows="2"
                placeholder="What's happening?"
                value={text}
                onChange={(e) => setText(e.target.value)}
              ></textarea>
            </div>
            {selectedFile && (
              <div className="relative">
                <XIcon
                  onClick={() => setSelectedFile(null)}
                  className="border h-7 text-black absolute cursor-pointer shadow-md border-white m-1 rounded-full"
                />
                <img
                  src={selectedFile}
                  className={`${loading && "animate-pulse"}`}
                />
              </div>
            )}
            <div className="flex items-center justify-between pt-2.5">
              {!loading && (
                <div className="flex">
                  <div
                    className=""
                    onClick={() => filePickerRef.current.click()}
                  >
                    <Photograph className="h-10 w-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100" />
                    <input
                      type="file"
                      hidden
                      ref={filePickerRef}
                      onChange={addImageToPost}
                      // accept image only .png, .jpg, .jpeg
                      accept="image/png, image/jpg, image/jpeg"
                    />
                  </div>
                  <EmojiHappy className="h-10 w-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100" />
                </div>
              )}
              <button
                onClick={sendPostToServer}
                disabled={!text.trim()}
                className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50"
              >
                Tweet
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
