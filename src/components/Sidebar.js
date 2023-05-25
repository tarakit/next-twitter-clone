"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import SidebarMenuItem from "./SidebarMenuItem";

import {
  HomeIconSolid,
  HastTagOutline,
  BookmarkOutline,
  ListOutline,
  MessengerOutline,
  MoreOutline,
  ProfileOutline,
  NotificationOutline,
  MoreSolid,
  DotHorizontal,
} from "./icons/Icons";
import { useSession, signIn, signOut } from "next-auth/react";
import { userState } from "@/atom/userAtom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";

export default function Sidebar() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useRecoilState(userState); // user atom
  const auth = getAuth();

  // get user data from firestore
  useEffect(() => {
    console.log("Current User: ", currentUser);
    // listen for auth state changes
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const fetchUser = async () => {
          // doc() method is used to get the document reference
          const docRef = doc(db, "users", auth.currentUser.providerData[0].uid);
          // getDoc() method is used to get the document snapshot
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setCurrentUser(docSnap.data());
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        };
        fetchUser();
      } else {
        setCurrentUser(null);
      }
    });
  }, []);

  // sign out
  const handleSignOut = () => {
    signOut(auth);
    setCurrentUser(null);
  };

  return (
    <div className="fixed hidden h-full flex-col p-2 sm:flex xl:ml-24 xl:items-start">
      {/* Twitter Logo */}
      <div className="hoverEffect p-0 hover:bg-blue-100 xl:px-1">
        <Image
          src="https://help.twitter.com/content/dam/help-twitter/brand/logo.png"
          width={50}
          height={50}
          alt="twitter logo"
        />
      </div>

      {/* Menu */}
      <div className="mb-2.5 mt-4 xl:items-start">
        <SidebarMenuItem text="Home" Icon={HomeIconSolid} active={true} />
        <SidebarMenuItem text="Explore" Icon={HastTagOutline} />
        {currentUser && (
          <>
            <SidebarMenuItem text="Notification" Icon={NotificationOutline} />
            <SidebarMenuItem text="Messages" Icon={MessengerOutline} />
            <SidebarMenuItem text="Bookmark" Icon={BookmarkOutline} />
            <SidebarMenuItem text="List" Icon={ListOutline} />
            <SidebarMenuItem text="Profile" Icon={ProfileOutline} />
            <SidebarMenuItem text="More" Icon={MoreOutline} />
          </>
        )}
      </div>

      {/* Button */}
      {currentUser ? (
        <>
          <button
            onClick={handleSignOut}
            className="hidden h-12 w-56 rounded-full bg-blue-400 text-lg font-bold text-white shadow-md hover:brightness-95 xl:inline"
          >
            {currentUser ? "Sign out" : "Sign in"}
          </button>
          {/* Mini Profile */}
          <div className="  hoverEffect mt-auto flex items-center justify-center text-gray-700 xl:justify-start">
            <img
              src={currentUser?.avatar || "https://i.imgur.com/6VBx3io.png"}
              alt={currentUser?.name || "Unknown"}
              className="h-10 w-10 rounded-full object-cover xl:mr-2"
            />

            <div className="hidden leading-5 xl:inline ">
              <h3 className="font-bold ">{currentUser?.name || "Unknown"}</h3>
              <p className="text-gray-500 ">
                {currentUser?.username || "Unknown"}
              </p>
            </div>
            <DotHorizontal className={"hidden h-5 xl:ml-8 xl:inline"} />
          </div>
        </>
      ) : (
        <button
          onClick={() => router.push("/auth/signin")}
          className="hidden h-12 w-36 rounded-full bg-blue-400 text-lg font-bold text-white shadow-md hover:brightness-95 xl:inline"
        >
          Sign in
        </button>
      )}
    </div>
  );
}
