import useProfile from "@/hooks/use-profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2Icon, SaveIcon, UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Nav from "./Nav";
import { Button } from "./ui/button";
import { DateRangePicker } from "./ui/date-range-picker";
import FloatingChatbot from "./ui/floating-chatbot";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CircleHelp } from "lucide-react";

const fitnessOptions = {
  goal: [
    { value: "lose_weight", label: "Lose Weight" },
    { value: "maintain_weight", label: "Maintain Weight" },
    { value: "gain_muscle", label: "Gain Muscle" },
  ],
  workoutLevel: [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ],
  focusMuscle: [
    { value: "full_body", label: "Full Body" },
    { value: "upper_body", label: "Upper Body" },
    { value: "lower_body", label: "Lower Body" },
    { value: "core", label: "Core & Abs" },
  ],
  exerciseType: [
    { value: "strength", label: "Strength Training" },
    { value: "cardio", label: "Cardio" },
    { value: "yoga", label: "Yoga & Flexibility" },
    { value: "mixed", label: "Mixed Training" },
  ],
};

const fitnessFormSchema = z.object({
  height: z.number(),
  weight: z.number(),
  goal: z.enum(["lose_weight", "maintain_weight", "gain_muscle"]),
  workoutLevel: z.enum(["beginner", "intermediate", "advanced"]),
  focusMuscle: z.enum(["full_body", "upper_body", "lower_body", "core"]),
  exerciseType: z.enum(["strength", "cardio", "yoga", "mixed"]),
  dailyWalking: z.number(),
  pushups: z.number(),
  activity_goal_count: z.number(),
  activity_goal_duration: z.string(),
  calorie_goal_count: z.number(),
  calorie_goal_duration: z.string(),
});

const Profile = () => {
  const { assessment, loading, updateAssessment } = useProfile();
  const [tempValues, setTempValues] = useState(assessment);
  const [isEditing, setIsEditing] = useState(false);
  const form = useForm({
    resolver: zodResolver(fitnessFormSchema),
    defaultValues: assessment,
  });

  useEffect(() => {
    if (assessment) setTempValues(assessment);
  }, [assessment]);

  const handleChange = (field, value) => {
    setTempValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    await updateAssessment(form.getValues());
    setIsEditing(false);
    toast.success("Fitness assessment updated successfully!");
  };

  return (
    <div className="flex relative min-h-screen">
      <Nav />
      <ScrollArea className="flex-1 h-screen">
        <div className="flex flex-col flex-1 gap-2 p-5 pt-20 mx-auto w-full md:pt-5">
          <div className="flex justify-between items-center mb-10">
            <div className="flex gap-4 items-center">
              <UserIcon size={40} />
              <h3 className="text-xl font-semibold">Your Profile</h3>
            </div>

            <div className="flex gap-2 items-center">
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit2Icon className="mr-2" /> Edit
                </Button>
              )}
              {isEditing && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setUpdatedValues(assessment);
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>

          {assessment ? (
            <Form {...form}>
              <form
                className="grid grid-cols-1 gap-4 md:grid-cols-2"
                onSubmit={form.handleSubmit(handleSave)}
              >
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (cm)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} disabled={!isEditing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currentWeight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} disabled={!isEditing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="goal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Goal</FormLabel>
                      <Select
                        disabled={!isEditing}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your goal" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {fitnessOptions.goal.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="workoutLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workout Level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!isEditing}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your activity level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {fitnessOptions.workoutLevel.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="focusMuscle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preffered Muscle Focus</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!isEditing}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your muscle focus" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {fitnessOptions.focusMuscle.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="exerciseType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exercise Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!isEditing}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your exercise type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {fitnessOptions.exerciseType.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dailyWalking"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daily Walking</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} disabled={!isEditing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pushups"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Push-ups Capacity</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} disabled={!isEditing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="activity_goal_count"
                  render={({ field }) => (
                    <FormItem>
                      <Popover>
                        <PopoverTrigger>
                          <div className="flex items-center gap-2">
                            <FormLabel>Activity Goal Count </FormLabel>
                            <CircleHelp className="text-primary" size={18} />
                          </div>
                        </PopoverTrigger>
                        <PopoverContent align="start">
                          How often do you workout based on the duration
                        </PopoverContent>
                      </Popover>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          disabled={!isEditing}
                          defaultValue={field.value}
                          onChange={(e) =>
                            field.onChange(Number.parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="activity_goal_duration"
                  render={({ field }) => (
                    <FormItem>
                      <Popover>
                        <PopoverTrigger>
                          <div className="flex items-center gap-2">
                            <FormLabel>Activity Goal Duration </FormLabel>
                            <CircleHelp className="text-primary" size={18} />
                          </div>
                        </PopoverTrigger>
                        <PopoverContent align="start">
                          How many days do you want to workout in your specific
                          duration?
                        </PopoverContent>
                      </Popover>
                      <FormControl>
                        <DateRangePicker
                          disabled={!isEditing}
                          onUpdate={(e) =>
                            field.onChange(
                              String(
                                `${e.range.from
                                  .toISOString()
                                  .slice(0, 10)}|${e.range.to
                                  .toISOString()
                                  .slice(0, 10)}`
                              )
                            )
                          }
                          initialDateFrom={
                            form
                              .getValues("activity_goal_duration")
                              ?.split("|")[0]
                              ? new Date(
                                  String(
                                    form.getValues("activity_goal_duration")
                                  ).split("|")[0]
                                )
                              : new Date()
                          }
                          initialDateTo={
                            form
                              .getValues("activity_goal_duration")
                              ?.split("|")[1]
                              ? new Date(
                                  String(
                                    form.getValues("activity_goal_duration")
                                  ).split("|")[1]
                                )
                              : new Date()
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="calorie_goal_count"
                  render={({ field }) => (
                    <FormItem>
                      <Popover>
                        <PopoverTrigger>
                          <div className="flex items-center gap-2">
                            <FormLabel>Calorie Goal Count </FormLabel>
                            <CircleHelp className="text-primary" size={18} />
                          </div>
                        </PopoverTrigger>
                        <PopoverContent align="start">
                          How many calories do you want to burn in your specific
                          duration? (Kcal)
                        </PopoverContent>
                      </Popover>
                      <FormControl>
                        <Input
                          type="number"
                          defaultValue={field.value}
                          onChange={(e) =>
                            field.onChange(Number.parseInt(e.target.value))
                          }
                          disabled={!isEditing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="calorie_goal_duration"
                  render={({ field }) => (
                    <FormItem>
                      <Popover>
                        <PopoverTrigger>
                          <div className="flex items-center gap-2">
                            <FormLabel>Calorie Goal Duration </FormLabel>
                            <CircleHelp className="text-primary" size={18} />
                          </div>
                        </PopoverTrigger>
                        <PopoverContent align="start">
                          For how long do you want to burn the calories?
                        </PopoverContent>
                      </Popover>
                      <FormControl>
                        <DateRangePicker
                          disabled={!isEditing}
                          onUpdate={(e) =>
                            field.onChange(
                              `${e.range.from
                                .toISOString()
                                .slice(0, 10)}|${e.range.to
                                .toISOString()
                                .slice(0, 10)}`
                            )
                          }
                          initialDateFrom={
                            form
                              .getValues("calorie_goal_duration")
                              ?.split("|")[0]
                              ? new Date(
                                  String(
                                    form.getValues("calorie_goal_duration")
                                  ).split("|")[0]
                                )
                              : new Date()
                          }
                          initialDateTo={
                            form
                              .getValues("calorie_goal_duration")
                              ?.split("|")[1]
                              ? new Date(
                                  String(
                                    form.getValues("calorie_goal_duration")
                                  ).split("|")[1]
                                )
                              : new Date()
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="col-span-full">
                  {isEditing && (
                    <Button
                      type="submit"
                      className="w-full"
                      onClick={handleSave}
                      disabled={loading || !form.formState.isDirty}
                    >
                      {loading ? (
                        "Saving..."
                      ) : (
                        <>
                          <SaveIcon className="mr-2" /> Save Changes
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          ) : (
            <p className="text-center">No fitness assessment found.</p>
          )}
        </div>
      </ScrollArea>

      <FloatingChatbot />
    </div>
  );
};

const EditableStatRow = ({
  label,
  value,
  field,
  editing,
  onChange,
  options,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <h5>{label}</h5>
      {options ? (
        <Select
          value={value}
          onValueChange={(value) => onChange(field, value)}
          disabled={!editing}
        >
          <SelectTrigger
            className={editing ? "border-input" : "border-transparent"}
          >
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          type="number"
          value={value || ""}
          onChange={(e) => editing && onChange(field, e.target.value)}
          disabled={!editing}
          className={editing ? "border-input" : "border-transparent"}
        />
      )}
    </div>
  );
};

export default Profile;
