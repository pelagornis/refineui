import { spacings } from "@refineui/tokens";
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
  ChartLine,
  ChartPlot,
  ChartTooltip,
  ChartYAxisLabels,
} from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

const BAR_VALUES = [186, 305, 237, 273, 209, 214];
const BAR_LABELS = ["1월", "2월", "3월", "4월", "5월", "6월"];
const LINE_VALUES = [186, 305, 237, 273, 209, 214, 320];
const LINE_LABELS = ["1월", "2월", "3월", "4월", "5월", "6월", "7월"];

export default function ChartPreview() {
  return (
    <PreviewFrame>
      <div
        style={{
          maxWidth: "560px",
          display: "flex",
          flexDirection: "column",
          gap: spacings.sizeXXLarge,
        }}
      >
        <Card variant="outlined">
          <CardHeader>
            <CardHeaderMain>
              <CardTitle>매출</CardTitle>
              <CardDescription>최근 6개월</CardDescription>
            </CardHeaderMain>
          </CardHeader>
          <CardContent>
            <Chart>
              <ChartBody>
                <ChartYAxisLabels lines={5} values={BAR_VALUES} />
                <ChartContent>
                  <ChartPlot aria-label="상반기 매출 막대 차트">
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

        <Card variant="outlined">
          <CardHeader>
            <CardHeaderMain>
              <CardTitle>활성 사용자</CardTitle>
              <CardDescription>최근 7개월</CardDescription>
            </CardHeaderMain>
          </CardHeader>
          <CardContent>
            <Chart>
              <ChartBody>
                <ChartYAxisLabels lines={5} values={LINE_VALUES} />
                <ChartContent>
                  <ChartPlot aria-label="월별 활성 사용자 선 차트">
                    <ChartGrid lines={5} values={LINE_VALUES} />
                    <ChartLine values={LINE_VALUES} seriesColor="info" />
                    <ChartTooltip />
                  </ChartPlot>
                  <ChartAxisLabels labels={LINE_LABELS} align="line" />
                </ChartContent>
              </ChartBody>
            </Chart>
          </CardContent>
        </Card>
      </div>
    </PreviewFrame>
  );
}
