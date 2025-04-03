import { useAuth } from "@/Context/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import useCurrentUser from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";
import {
  GripIcon as BicepsFlexedIcon,
  BarChartIcon as ChartNoAxesCombinedIcon,
  Dumbbell,
  LayoutGridIcon,
  LogOut,
  Menu,
  UserIcon,
} from "lucide-react"; // Sidebar Icons
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button, buttonVariants } from "./ui/button";

const Nav = () => {
  const { session, signInUser, signOut } = useAuth();
  const { user } = useCurrentUser();
  const [assessment, setAssessment] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssessment = async () => {
      if (!user) {
        console.warn("User not found, cannot fetch assessment.");
        return;
      }

      const { data, error } = await supabase
        .from("fitness_assessments")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Supabase Error:", error.message);
      } else {
        setAssessment(data);
      }
    };

    fetchAssessment();
  }, [user]);

  const NavContent = () => (
    <>
      <div className="flex gap-3 items-center mb-8">
        <img src="/images/logo.png" className="w-12" alt="Logo" />
        <h4 className="italic text-primary">FitMission</h4>
      </div>

      <nav className="flex flex-col flex-grow gap-2">
        <Link to="/dashboard">
          <Button variant="ghost" className="justify-start w-full">
            <LayoutGridIcon size={20} className="mr-2" />
            Dashboard
          </Button>
        </Link>
        <Link to="/challenge">
          <Button variant="ghost" className="justify-start w-full">
            <ChartNoAxesCombinedIcon size={20} className="mr-2" />
            Tracker
          </Button>
        </Link>
        {/* <Link to="/chatbot">
          <Button variant="ghost" className="justify-start w-full">
            <BotIcon size={20} className="mr-2" />
            AI Coach
          </Button>
        </Link> */}
        <Link to="/challenges">
          <Button variant="ghost" className="justify-start w-full">
            <Dumbbell size={20} className="mr-2" />
            Challenge
          </Button>
        </Link>
        <Link to="/fitness">
          <Button variant="ghost" className="justify-start w-full">
            <BicepsFlexedIcon size={20} className="mr-2" />
            Fitness & Diet
          </Button>
        </Link>
        <Link to="/profile">
          <Button variant="ghost" className="justify-start w-full">
            <UserIcon size={20} className="mr-2" />
            Profile
          </Button>
        </Link>
        {/* <Link to="/forum">
          <Button variant="ghost" className="justify-start w-full">
            <ScrollIcon size={20} className="mr-2" />
            Forum
          </Button>
        </Link> */}
      </nav>

      <div className="mt-auto">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full">
              <LogOut size={18} className="mr-2" /> Sign Out
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Do you really want to end your session?
              </AlertDialogTitle>
              <AlertDialogDescription>
                All unsaved changes will be lost. Please proceed with caution.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  signOut();
                  window.localStorage.removeItem("app-cache");
                  navigate("/");
                }}
                className={cn(
                  buttonVariants({
                    variant: "destructive",
                  })
                )}
              >
                Sign Out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Navigation with Sheet */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button size="icon">
              <Menu size={28} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-4 w-[280px] bg-sidebar">
            <div className="flex flex-col py-6 h-full">
              <NavContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden sticky top-0 z-40 flex-col p-4 w-72 h-screen shadow-xl md:flex bg-sidebar">
        <NavContent />
      </div>
    </>
  );
};

export default Nav;
