import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, Router as WouterRouter } from "wouter";
import NotFound from "@/pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ExperienceProvider } from "./contexts/ExperienceContext";
import { AuroraBackground } from "./components/ui/aurora-background";
import Home from "./pages/Home";


function Router() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/404" component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <ExperienceProvider>
          <TooltipProvider>
            <AuroraBackground>
              <Toaster />
              <Router />
            </AuroraBackground>
          </TooltipProvider>
        </ExperienceProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
