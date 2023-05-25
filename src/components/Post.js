import React, { useEffect, useState } from "react";
import {
  ChartIcon,
  ChatIcon,
  DotHorizontal,
  HeartFill,
  HeartOutline,
  ShareIcon,
  TrashIcon,
} from "./icons/Icons";
import Moment from "react-moment";
import { useRecoilState } from "recoil";
import { modalState, postIdState } from "@/atom/modalAtom";
import { userState } from "@/atom/userAtom";
import { useRouter } from "next/navigation";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { db, storage } from "../../firebase";
import { deleteObject, ref } from "firebase/storage";
import CommentModal from "./CommentModal";

export default function Post({ post, id }) {
  const [likes, setLike] = useState([]);
  const [comments, setComment] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [open, setOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const [currentUser] = useRecoilState(userState);

  const router = useRouter();

  // this for get comments from firebase
  useEffect(() => {
    
    const unsubscribe = onSnapshot(
      collection(db, "posts", id, "comments"),
      (snapshot) => {
        setComment(snapshot.docs);
      }
    );
  }, [db]);

  // this for get likes from firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts", id, "likes"),
      (snapshot) => {
        setLike(snapshot.docs);
      }
    );
  }, [db]);

  // this for check if user liked the post or not
  useEffect(() => {
    setHasLiked(likes.findIndex((like) => like.id === currentUser?.uid) !== -1);
  }, [likes, currentUser]);

  // like the post
  const likePost = async () => {
    if (currentUser) {
      if (hasLiked) {
        await deleteDoc(doc(db, "posts", id, "likes", currentUser?.uid));
      } else {
        await setDoc(doc(db, "posts", id, "likes", currentUser?.uid), {
          username: currentUser?.username,
        });
      }
    } else {
      router.push("/auth/signin");
    }
  };

  // delete the post
  const deletePost = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await deleteDoc(doc(db, "posts", id));
      if (post.data().image) {
        deleteObject(ref(storage, `posts/${id}/image`));
      }
      router.push("/");
    }
  };

  return (
    <div className="flex flex-wrap p-3 cursor-pointer border-b border-gray-200">
      {/* user image */}
      <img
        className="h-11 w-11 rounded-full mr-4"
        src={post?.data()?.avatar || "/images/user.png"}
        alt="user-images"
      />

      {/* right side */}
      <div  className="flex-1 ">
        {/* Header */}
        <div className="flex items-center justify-between ">
          {/* post user info */}
          <div className="flex items-center space-x-1 whitespace-nowrap">
            <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
              {post?.data().name}
            </h4>
            <span className="text-sm sm:text-[15px]">
              @{post?.data().username} -{" "}
            </span>
            <span className="text-sm sm:text-[15px] hover:underline">
              <Moment fromNow>{post?.data()?.timestamp?.toDate()}</Moment>
            </span>
          </div>

          {/* dot icon */}
          <DotHorizontal className="h-10 hoverEffect w-10 hover:bg-sky-100 hover:text-sky-500 p-2 " />
        </div>

        {/* post text */}
        <p
          
          className="text-gray-800 text-[15px sm:text-[16px] mb-2"
        >
          {post?.data().text}
        </p>

        {/* post image */}
        <img onClick={() => router.push(`/posts/${id}`)} className=" rounded-2xl mr-2" src={post?.data().image} alt={post?.data().text || "post picture"} />

        {/* icons */}

        <div className="flex justify-between text-gray-500 p-2">
          <div className="flex items-center select-none">
            <ChatIcon
              onClick={() => {
                if (!currentUser) {
                  // signIn();
                  router.push("/auth/signin");
                } else {
                  setPostId(id);
                  setOpen(!open);
                }
              }}
              className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100"
            />
            {comments.length > 0 && (
              <span className="text-sm">{comments.length}</span>
            )}
          </div>
          {currentUser?.uid === post?.data()?.id && (
            <TrashIcon
              onClick={deletePost}
              className="h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100"
            />
          )}
          <div className="flex items-center">
            {hasLiked ? (
              <HeartFill
                onClick={likePost}
                className="h-9 w-9 hoverEffect p-2 text-red-600 hover:bg-red-100"
              />
            ) : (
              <HeartOutline
                onClick={likePost}
                className="h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100"
              />
            )}
            {likes.length > 0 && (
              <span
                className={`${hasLiked && "text-red-600"} text-sm select-none`}
              >
                {" "}
                {likes.length}
              </span>
            )}
          </div>


          <ShareIcon className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100" />
          <ChartIcon className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100" />
        </div>
      </div>
    </div>
  );
}
