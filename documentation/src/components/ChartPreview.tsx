import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardHeaderMain,
  CardTitle,
  Chart,
  ChartAxisLabels,
  ChartBars,
  ChartBody,
  ChartContent,
  ChartGrid,
  ChartPlot,
  ChartTooltip,
  ChartYAxisLabels,
} from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

const BAR_VALUES = [186, 305, 237, 273, 209, 214];
const BAR_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

export default function ChartPreview() {
  return (
    <Looks>
      <Look align="stretch">
        <Card variant="outlined" className="w-full">
          <CardHeader>
            <CardHeaderMain>
              <CardTitle>Revenue</CardTitle>
              <CardDescription>Last 6 months</CardDescription>
            </CardHeaderMain>
          </CardHeader>
          <CardContent>
            <Chart>
              <ChartBody>
                <ChartYAxisLabels lines={5} values={BAR_VALUES} />
                <ChartContent>
                  <ChartPlot aria-label="Half-year revenue bar chart">
                    <ChartGrid lines={5} values={BAR_VALUES} />
                    <ChartBars values={BAR_VALUES} seriesColor="brand" />
                    <ChartTooltip />
                  </ChartPlot>
                  <ChartAxisLabels labels={BAR_LABELS} />
                </ChartContent>
              </ChartBody>
            </Chart>
          </CardContent>
        </Card>
      </Look>
    </Looks>
  );
}
