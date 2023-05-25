


import CommentModal from "@/components/CommentModal";
import Feed from "@/components/Feed";
import Sidebar from "@/components/Sidebar";
import Widgets from "@/components/Widgets";


export async function getData() {
  const newsResults = await fetch(
    "https://saurav.tech/NewsAPI/top-headlines/category/business/us.json"
  ).then((res) => res.json());

  // Who to follow section

  let randomUsersResults = [];

  try {
    const res = await fetch(
      "https://randomuser.me/api/?results=30&inc=name,login,picture"
    );

    randomUsersResults = await res.json();
  } catch (err) {
    randomUsersResults = [];
  }

  return {
    newsResults,
    randomUsersResults,
  };
}

export const metadata = {
  title: "Twitter Clone - Build Your Own Social Network for Real-Time Communication and Social Media Sharing",
  description: "Create your own social network with Twitter-Clone. Connect with friends, share content, and stay up-to-date on the latest trends in real-time.",
};

export default async function Home() {
  const { newsResults, randomUsersResults } = await getData();

  return (
    <>

      <main className="flex min-h-screen max-w-7xl mx-auto ">
        {/* Sidebar */}
        <Sidebar />

        {/* Feed */}
        <Feed />

        {/* Widgets */}
        <Widgets
          newsResults={newsResults?.articles}
          randomUsersResults={randomUsersResults?.results || null}
        />

        {/* Modal */}
        <CommentModal />
      </main>
    </>
  );
}
