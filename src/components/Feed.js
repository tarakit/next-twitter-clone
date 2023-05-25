'use client'
import React, { useEffect } from "react";
import { Sparkles } from "./icons/Icons";
import Input from "./Input";
import Post from "./Post";
import { collection, onSnapshot, orderBy } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { db } from "../../firebase";

export default function Feed() {
  const [posts, setPosts] = React.useState([]);
  useEffect(() => {
    // get the posts from firebase

    // onSnapshot use to listen to the changes in the collection

    onSnapshot(
      collection(db, "posts"),
      orderBy("timestamp", "desc"),
      (snapshot) => {
        setPosts(snapshot.docs);
      }
    );
  }, []);
  
  return (
    <div className="xl:ml-[370px] border-l border-r border-gray-200  xl:min-w-[576px] sm:ml-[73px] flex-grow max-w-xl">
      {/* Home header */}
      <div className="flex py-2 px-3 sticky top-0 z-50 bg-white border-b border-gray-200">
        <h1 className="text-lg sm:text-xl font-bold cursor-pointer">Home</h1>
        <div className="hoverEffect flex items-center justify-center px-0 ml-auto w-9 h-9">
          <Sparkles className={"h-5"} />
        </div>
      </div>

      {/* Input */}
      <Input />

      {/* Post */}
      <AnimatePresence>
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <Post key={post.id} post={post} id={post.id} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
