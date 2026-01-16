import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import CharacterCreatePage from "./pages/CharacterCreatePage";
import GamePage from "./pages/GamePage";
import ParentDashboardPage from "./pages/ParentDashboardPage";
import TeacherDashboardPage from "./pages/TeacherDashboardPage";
import AgentDemoPage from "./pages/AgentDemoPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/character-create" element={<CharacterCreatePage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/parent" element={<ParentDashboardPage />} />
          <Route path="/teacher" element={<TeacherDashboardPage />} />
          <Route path="/agents" element={<AgentDemoPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
