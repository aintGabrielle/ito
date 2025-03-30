import {
  BicepsFlexedIcon,
  ExternalLinkIcon,
  PlusCircleIcon,
  TrendingUpIcon,
} from "lucide-react";
import Nav from "./Nav";
import { ScrollArea } from "./ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ChartContainer } from "./ui/chart";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import AddActivityModal from "./pages/challenge/add-activity-modal";

const Fitness = () => {
  const chartData = [
    { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  ];
  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    safari: {
      label: "Safari",
      color: "hsl(var(--chart-2))",
    },
  };

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
                  <CardDescription>January - June 2024</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                  <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                  >
                    <RadialBarChart
                      data={chartData}
                      startAngle={0}
                      endAngle={250}
                      innerRadius={80}
                      outerRadius={110}
                    >
                      <PolarGrid
                        gridType="circle"
                        radialLines={false}
                        stroke="none"
                        className="first:fill-muted last:fill-background"
                        polarRadius={[86, 74]}
                      />
                      <RadialBar
                        dataKey="visitors"
                        background
                        cornerRadius={10}
                      />
                      <PolarRadiusAxis
                        tick={false}
                        tickLine={false}
                        axisLine={false}
                      >
                        <Label
                          content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                              return (
                                <text
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                >
                                  <tspan
                                    x={viewBox.cx}
                                    y={viewBox.cy}
                                    className="text-4xl font-bold fill-foreground"
                                  >
                                    {chartData[0].visitors.toLocaleString()}
                                  </tspan>
                                  <tspan
                                    x={viewBox.cx}
                                    y={(viewBox.cy || 0) + 24}
                                    className="fill-muted-foreground"
                                  >
                                    kcal
                                  </tspan>
                                </text>
                              );
                            }
                          }}
                        />
                      </PolarRadiusAxis>
                    </RadialBarChart>
                  </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col gap-2 text-sm">
                  <div className="flex gap-2 items-center font-medium leading-none">
                    5% of 1000 kcal
                  </div>
                  <div className="leading-none text-muted-foreground">
                    Showing total calories burned for this month
                  </div>
                </CardFooter>
              </Card>
              <Card className="flex flex-col flex-1">
                <CardHeader className="items-center pb-0">
                  <CardTitle>Workout Monitor</CardTitle>
                  <CardDescription>January - June 2024</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                  <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                  >
                    <RadialBarChart
                      data={chartData}
                      startAngle={0}
                      endAngle={250}
                      innerRadius={80}
                      outerRadius={110}
                    >
                      <PolarGrid
                        gridType="circle"
                        radialLines={false}
                        stroke="none"
                        className="first:fill-muted last:fill-background"
                        polarRadius={[86, 74]}
                      />
                      <RadialBar
                        dataKey="visitors"
                        background
                        cornerRadius={10}
                      />
                      <PolarRadiusAxis
                        tick={false}
                        tickLine={false}
                        axisLine={false}
                      >
                        <Label
                          content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                              return (
                                <text
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                >
                                  <tspan
                                    x={viewBox.cx}
                                    y={viewBox.cy}
                                    className="text-4xl font-bold fill-foreground"
                                  >
                                    {chartData[0].visitors.toLocaleString()}
                                  </tspan>
                                  <tspan
                                    x={viewBox.cx}
                                    y={(viewBox.cy || 0) + 24}
                                    className="fill-muted-foreground"
                                  >
                                    Activities
                                  </tspan>
                                </text>
                              );
                            }
                          }}
                        />
                      </PolarRadiusAxis>
                    </RadialBarChart>
                  </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col gap-2 text-sm">
                  <div className="flex gap-2 items-center font-medium leading-none">
                    1% of 100 activities
                  </div>
                  <div className="leading-none text-muted-foreground">
                    Showing total activities for this month
                  </div>
                </CardFooter>
              </Card>

              {/* logs */}
              <div className="flex flex-col flex-1 col-span-full">
                <h4>Workout Logs</h4>
                
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Fitness;
