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
import FloatingChatbot from "./ui/floating-chatbot";

const Fitness = () => {
  const { assessment } = useProfile();
  const { workouts } = useWorkouts();

  const totalWorkouts = !!workouts ? workouts.length : 0;
  const totalCalories =
    totalWorkouts > 0
      ? workouts.reduce((acc, workout) => acc + workout.calories_burned, 0)
      : 0;
  const totalDuration =
    workouts > 0
      ? workouts.reduce((acc, workout) => acc + workout.duration, 0)
      : 0;

  return (
    <div className="flex relative min-h-screen">
      <Nav />
      <ScrollArea className="flex-1 p-6 h-full">
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
                    {assessment.calorie_goal_duration ? (
                      <>
                        {datefn.format(
                          String(assessment.calorie_goal_duration).split(
                            "|"
                          )[0],
                          "MMMM dd, yyyy"
                        )}{" "}
                        to{" "}
                        {datefn.format(
                          String(assessment.calorie_goal_duration).split(
                            "|"
                          )[1],
                          "MMMM dd, yyyy"
                        )}
                      </>
                    ) : (
                      "Please set your calorie goal duration in the Profile Page"
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                  <div className="flex justify-center">
                    <CircleProgress
                      value={
                        assessment.calorie_goal_count
                          ? (totalWorkouts / assessment?.calorie_goal_count) *
                            100
                          : 0
                      }
                      size={200}
                      showLabel={true}
                      renderLabel={(e) => {
                        return assessment.calorie_goal_count ? (
                          <>
                            <span className="flex flex-col items-center leading-none">
                              <span className="text-3xl font-bold">
                                {totalCalories}
                              </span>
                              <span className="opacity-50">kcal</span>
                            </span>
                          </>
                        ) : (
                          "Unavailable"
                        );
                      }}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-2 text-sm">
                  {assessment.calorie_goal_count && (
                    <>
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
                    </>
                  )}
                </CardFooter>
              </Card>
              <Card className="flex flex-col flex-1">
                <CardHeader className="items-center pb-0">
                  <CardTitle>Workout Monitor</CardTitle>
                  <CardDescription>
                    {/* {datefn.format(
                      String(assessment.activity_goal_duration).split("|")[0],
                      "MMMM dd, yyyy"
                    )}{" "}
                    to{" "}
                    {datefn.format(
                      String(assessment.activity_goal_duration).split("|")[1],
                      "MMMM dd, yyyy"
                    )} */}
                    {assessment.activity_goal_duration ? (
                      <>
                        {datefn.format(
                          String(assessment.activity_goal_duration).split(
                            "|"
                          )[0],
                          "MMMM dd, yyyy"
                        )}{" "}
                        to{" "}
                        {datefn.format(
                          String(assessment.activity_goal_duration).split(
                            "|"
                          )[1],
                          "MMMM dd, yyyy"
                        )}
                      </>
                    ) : (
                      "Please set your activity goal duration in the Profile Page"
                    )}

                    {/* {assessment.activity_goal_duration} */}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                  <div className="flex justify-center">
                    <CircleProgress
                      value={
                        assessment.activity_goal_count
                          ? (totalWorkouts / assessment?.activity_goal_count) *
                            100
                          : 0
                      }
                      size={200}
                      showLabel={true}
                      renderLabel={(e) => {
                        return assessment.activity_goal_count ? (
                          <>
                            <span className="flex flex-col items-center leading-none">
                              <span className="text-3xl font-bold">
                                {totalWorkouts}
                              </span>
                              <span className="opacity-50">activities</span>
                            </span>
                          </>
                        ) : (
                          "Unavailable"
                        );
                      }}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-2 text-sm">
                  {assessment.activity_goal_count && (
                    <>
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
                    </>
                  )}
                </CardFooter>
              </Card>

              {/* logs */}
              <div className="flex flex-col flex-1 gap-3">
                <h4>Workout Logs</h4>

                <div className="flex flex-col flex-1 gap-3">
                  {workouts?.map((workout) => (
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
      <FloatingChatbot />
    </div>
  );
};

export default Fitness;
