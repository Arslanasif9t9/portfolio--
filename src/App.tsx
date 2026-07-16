import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CV from "./components/Resume";

// Admin panel is code-split so visitors never download it
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminShell = lazy(() => import("./pages/admin/AdminShell"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const MessagesPage = lazy(() => import("./pages/admin/MessagesPage"));
const UsersPage = lazy(() => import("./pages/admin/UsersPage"));
const ContactInbox = lazy(() => import("./pages/admin/ContactInbox"));
const FeedbackPage = lazy(() => import("./pages/admin/FeedbackPage"));
const ApiKeysPage = lazy(() => import("./pages/admin/ApiKeysPage"));
const NotificationsPage = lazy(() => import("./pages/admin/NotificationsPage"));
const SettingsPage = lazy(() => import("./pages/admin/SettingsPage"));
const ProfilePage = lazy(() => import("./pages/admin/ProfilePage"));

const queryClient = new QueryClient();

const AdminFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/portfolio--">
        <Suspense fallback={<AdminFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/CV" element={<CV />} />
            <Route path="/admin9t9/login/1257" element={<AdminLogin />} />
            <Route path="/admin9t9" element={<AdminShell />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="messages" element={<MessagesPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="contact" element={<ContactInbox />} />
              <Route path="feedback" element={<FeedbackPage />} />
              <Route path="api-keys" element={<ApiKeysPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
