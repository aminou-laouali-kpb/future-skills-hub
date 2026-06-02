import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { LiteModeProvider } from "@/contexts/LiteModeContext";
import { Navbar } from "@/components/Navbar";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Modules from "./pages/Modules";
import ModuleDetail from "./pages/ModuleDetail";
import Quiz from "./pages/Quiz";
import Deliverables from "./pages/Deliverables";
import Feedback from "./pages/Feedback";
import Mentoring from "./pages/Mentoring";
import Resources from "./pages/Resources";
import Admin from "./pages/Admin";
import Support from "./pages/Support";
import DayPlan from "./pages/DayPlan";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <LiteModeProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/modules" element={<Modules />} />
              <Route path="/modules/:moduleId" element={<ModuleDetail />} />
              <Route path="/modules/:moduleId/quiz" element={<Quiz />} />
              <Route path="/deliverables" element={<Deliverables />} />
              <Route path="/deliverables/:deliverableId/feedback" element={<Feedback />} />
              <Route path="/mentoring" element={<Mentoring />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/plan-jour" element={<DayPlan />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/support" element={<Support />} />
              <Route path="/faq" element={<Support />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <WhatsAppFab />
            <ConnectionStatus />
          </BrowserRouter>
        </LiteModeProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
