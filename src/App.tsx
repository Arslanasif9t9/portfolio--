import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CV from "./components/Resume";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminShell from "./pages/admin/AdminShell";
import Dashboard from "./pages/admin/Dashboard";
import MessagesPage from "./pages/admin/MessagesPage";
import UsersPage from "./pages/admin/UsersPage";
import ContactInbox from "./pages/admin/ContactInbox";
import FeedbackPage from "./pages/admin/FeedbackPage";
import ApiKeysPage from "./pages/admin/ApiKeysPage";
import NotificationsPage from "./pages/admin/NotificationsPage";
import SettingsPage from "./pages/admin/SettingsPage";
import ProfilePage from "./pages/admin/ProfilePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/portfolio--">
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
