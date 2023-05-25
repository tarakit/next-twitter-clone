"use client";
import Post from "@/components/Post";
import Sidebar from "@/components/Sidebar";
import { ArrowLeft } from "@/components/icons/Icons";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { db } from "../../../../firebase";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import Comment from "@/components/Comment";
import Widgets from "@/components/Widgets";
import CommentModal from "@/components/CommentModal";

// https://saurav.tech/NewsAPI/top-headlines/category/business/us.json

export const metadata = {
  title:
    "Twitter Clone - Build Your Own Social Network for Real-Time Communication and Social Media Sharing",
  description:
    "Create your own social network with Twitter-Clone. Connect with friends, share content, and stay up-to-date on the latest trends in real-time.",
};

export default function PostDetails({ params }) {
  const [newsResults, setNewsResults] = useState([]);
  const [randomUsersResult, setRandomUsersResult] = useState([]);
  const router = useRouter();
  const { id } = params;
  console.log("this is id: ", id);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  // get news and follower
  useEffect(() => {
    // fetch news
    fetch(
      "https://saurav.tech/NewsAPI/top-headlines/category/business/us.json",
      { cache: "force-cache" }
    )
      .then((res) => res.json())
      .then((data) => {
        setNewsResults(data);
      });

    // fetch random users
    fetch("https://randomuser.me/api/?results=30&inc=name,login,picture", {
      cache: "force-cache",
    })
      .then((res) => res.json())
      .then((data) => {
        setRandomUsersResult(data);
      });
  }, []);

  // get post from firebase
  useEffect(() => {
    onSnapshot(doc(db, "posts", id), (snapshot) => {
      console.log("this is snapshot: ", snapshot);
      setPost(snapshot);
    });
  }, [db, id]);

  // get comments from firebase
  useEffect(() => {
    onSnapshot(
      query(
        collection(db, "posts", id, "comments"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => {
        console.log("this is snapshot comment: ", snapshot.docs);
        setComments(snapshot.docs);
      }
    );
  }, [db, id]);

  return (
    <>
      <main className="max-auto flex min-h-screen">
        {/* Side bar */}
        <Sidebar />

        {/* Feed */}
        <div className="max-w-xl flex-grow border-l border-r  border-gray-200 sm:ml-[73px] xl:ml-[370px] xl:min-w-[576px]">
          <div className="sticky top-0 z-50  flex items-center space-x-2 border-b border-gray-200 bg-white px-3 py-2">
            <div onClick={() => router.push("/")} className="hoverEffect">
              <ArrowLeft className="h-5" />
            </div>
            <h2 className="cursor-pointer text-lg font-bold sm:text-xl">
              Tweet
            </h2>
          </div>

          {/* Post */}
          {post && <Post key={post.id} post={post} id={post.id} />}
          {/* Comments */}
          {comments.length > 0 && (
            <div className="flex-1 overflow-x-auto">
              <AnimatePresence>
                {comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                  >
                    <Comment
                      key={comment.id}
                      commentId={comment.id}
                      originalPostId={id}
                      comment={comment.data()}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
        {/* Widgets */}

        {randomUsersResult && newsResults && (
          <Widgets
            newsResults={newsResults.articles}
            randomUsersResults={randomUsersResult.results}
          />
        )}

        {/* Modal */}

        <CommentModal />
      </main>
    </>
  );
}
