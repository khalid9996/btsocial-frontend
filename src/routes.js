import { useRoutes } from "react-router-dom";
import {
  AuthTabs,
  ResetPassword,
  FeedsSkeleton,
  // Feeds,
  // Chat,
  // People,
  // Following,
  // Followers,
  // Photos,
  // Notifications,
  // Profile,
} from "./pages";
import ProtectedRoute from "./pages/ProtectedRoute";
import Error from "./pages/error/Error";
import { Suspense, lazy } from "react";
import NotificationSkeleton from "./pages/app/notifications/NotificationSkeleton";
import CardSkeleton from "./components/card-element/CardSkeleton";
import PhotoSkeleton from "./pages/app/photos/PhotoSkeleton";
import ProfileSkeleton from "./pages/app/profile/ProfileSkeleton";
// import Spinner from "./components/spinner/Spinner";
import ChatSkeleton from "./pages/app/chat/ChatSkeleton";

const App = lazy(() => import("./pages/app/App"));
const Chat = lazy(() => import("./pages/app/chat/Chat"));
const Followers = lazy(() => import("./pages/app/followers/Followers"));
const Following = lazy(() => import("./pages/app/following/Following"));
const People = lazy(() => import("./pages/app/people/People"));
const Photos = lazy(() => import("./pages/app/photos/Photos"));
const Profile = lazy(() => import("./pages/app/profile/Profile"));
const Feeds = lazy(() => import("./pages/app/feeds/Feeds"));
const Notifications = lazy(() =>
  import("./pages/app/notifications/Notifications")
);

export const AppRouter = () => {
  const elements = useRoutes([
    {
      path: "/",
      element: <AuthTabs />,
    },
    {
      path: "/reset-password",
      element: <ResetPassword />,
    },
    {
      path: "/app/home",
      element: (
        <ProtectedRoute>
          <App />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "feeds",
          element: (
            <Suspense fallback={<FeedsSkeleton />}>
              <Feeds />
            </Suspense>
          ),
        },
        {
          path: "chat/messages",
          element: (
            <Suspense fallback={<ChatSkeleton />}>
              <Chat />
            </Suspense>
          ),
        },
        {
          path: "people",
          element: (
            <Suspense fallback={<CardSkeleton />}>
              <People />
            </Suspense>
          ),
        },
        {
          path: "following",
          element: (
            <Suspense fallback={<CardSkeleton />}>
              <Following />
            </Suspense>
          ),
        },
        {
          path: "followers",
          element: (
            <Suspense>
              <Followers fallback={<CardSkeleton />} />
            </Suspense>
          ),
        },
        {
          path: "photos",
          element: (
            <Suspense fallback={<PhotoSkeleton />}>
              <Photos />
            </Suspense>
          ),
        },
        {
          path: "notifications",
          element: (
            <Suspense fallback={<NotificationSkeleton />}>
              <Notifications />
            </Suspense>
          ),
        },
        {
          path: "profile/:username",
          element: (
            <Suspense fallback={<ProfileSkeleton />}>
              <Profile />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: "*",
      element: <Error />,
    },
  ]);

  return elements;
};
