import useProfile from "@/hooks/use-profile";
import useWorkouts from "@/hooks/use-workouts";
import * as datefn from "date-fns";
import { BicepsFlexedIcon, Clock4Icon, PlusCircleIcon } from "lucide-react";
import Nav from "./Nav";
import AddActivityModal from "./pages/challenge/add-activity-modal";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import CircleProgress from "./ui/circle-progress";
import { ScrollArea } from "./ui/scroll-area";

const Fitness = () => {
  const { assessment } = useProfile();
  const { workouts } = useWorkouts();

  const totalCalories = workouts.reduce(
    (acc, workout) => acc + workout.calories_burned,
    0
  );
  const totalDuration = workouts.reduce(
    (acc, workout) => acc + workout.duration,
    0
  );
  const totalWorkouts = workouts.length;

  return (
    <div className="flex relative min-h-screen">
      <Nav />
      <ScrollArea className="flex-1 p-6 h-screen">
        <div className="space-y-6">
          <div className="flex gap-4 items-center">
            <BicepsFlexedIcon size={40} />
            <h3>Fitness & Diet</h3>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex justify-end">
              <AddActivityModal
                triggerComponent={
                  <Button>
                    <span>Add Activity</span>
                    <PlusCircleIcon />
                  </Button>
                }
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card className="flex flex-col flex-1">
                <CardHeader className="items-center pb-0">
                  <CardTitle>Calorie Burned</CardTitle>
                  <CardDescription>
                    {datefn.format(
                      String(assessment.calorie_goal_duration).split("|")[0],
                      "MMMM dd, yyyy"
                    )}{" "}
                    to{" "}
                    {datefn.format(
                      String(assessment.calorie_goal_duration).split("|")[1],
                      "MMMM dd, yyyy"
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                  <div className="flex justify-center">
                    <CircleProgress
                      value={
                        (totalCalories / assessment?.calorie_goal_count) * 100
                      }
                      size={200}
                      showLabel={true}
                      renderLabel={(e) => {
                        return (
                          <span className="flex flex-col items-center leading-none">
                            <span className="text-3xl font-bold">
                              {totalCalories}
                            </span>
                            <span className="opacity-50">kcal</span>
                          </span>
                        );
                      }}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-2 text-sm">
                  <div className="flex gap-2 items-center font-medium leading-none">
                    {(
                      (totalCalories / assessment?.calorie_goal_count) *
                      100
                    ).toFixed(2)}
                    % of {assessment?.calorie_goal_count} kcal
                  </div>
                  <div className="leading-none text-muted-foreground">
                    Showing total calories burned
                  </div>
                </CardFooter>
              </Card>
              <Card className="flex flex-col flex-1">
                <CardHeader className="items-center pb-0">
                  <CardTitle>Workout Monitor</CardTitle>
                  <CardDescription>
                    {datefn.format(
                      String(assessment.activity_goal_duration).split("|")[0],
                      "MMMM dd, yyyy"
                    )}{" "}
                    to{" "}
                    {datefn.format(
                      String(assessment.activity_goal_duration).split("|")[1],
                      "MMMM dd, yyyy"
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                  <div className="flex justify-center">
                    <CircleProgress
                      value={
                        (totalWorkouts / assessment?.activity_goal_count) * 100
                      }
                      size={200}
                      showLabel={true}
                      renderLabel={(e) => {
                        return (
                          <span className="flex flex-col items-center leading-none">
                            <span className="text-3xl font-bold">
                              {totalWorkouts}
                            </span>
                            <span className="opacity-50">activities</span>
                          </span>
                        );
                      }}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-2 text-sm">
                  <div className="flex gap-2 items-center font-medium leading-none">
                    {(
                      (totalWorkouts / assessment?.activity_goal_count) *
                      100
                    ).toFixed(2)}
                    % of {assessment?.activity_goal_count} activities
                  </div>
                  <div className="leading-none text-muted-foreground">
                    Showing total activities
                  </div>
                </CardFooter>
              </Card>

              {/* logs */}
              <div className="flex flex-col flex-1 gap-3">
                <h4>Workout Logs</h4>

                <div className="flex flex-col flex-1 gap-3">
                  {workouts.map((workout) => (
                    <div
                      key={workout?.id}
                      className="flex justify-between p-3 rounded-lg border border-border"
                    >
                      <h6 className="font-semibold">{workout?.exercise}</h6>
                      <div className="flex gap-2">
                        <div className="flex gap-1 items-center text-sm">
                          <Clock4Icon size={20} />
                          {workout?.duration}mins
                        </div>
                        <div className="flex gap-1 items-center text-sm">
                          <BicepsFlexedIcon size={20} />
                          {workout?.calories_burned}kcal
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Fitness;
