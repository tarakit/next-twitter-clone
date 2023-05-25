/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["img.freepik.com", "help.twitter.com"],
  },
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: "AIzaSyAQxx2lvv9tPnKAZexE8rzGsglU7QoTUI8",
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "twitter-clone-v1-f0bf2.firebaseapp.com",
    NEXT_PUBLIC_PROJECT_ID: "twitter-clone-v1-f0bf2",
    NEXT_PUBLIC_STORAGE_BUCKET: "twitter-clone-v1-f0bf2.appspot.com",
    NEXT_PUBLIC_MESSAGING_SENDER_ID: "933825149181",
    NEXT_PUBLIC_APP_ID: "1:933825149181:web:92fd1521bf16427586a694",

    GOOGLE_CLIENT_ID:
      "933825149181-8k1ssb6st453n0enc321d6lqv3akn7eb.apps.googleusercontent.com",
    GOOGLE_CLIENT_SECRET: "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",
  },
};

module.exports = nextConfig;
