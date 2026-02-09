import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import {
   LineChart,
   Line,
   XAxis,
   YAxis,
   Tooltip,
   ResponsiveContainer,
   type TooltipProps,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/shadcn/card"
import type { ITasksFlowSeries, TasksFlowChartPoint, TasksFlowPoint } from "../../types/"

type TPeriod = "month" | "week"

type ChartValueKey = "created" | "completed"

interface TooltipPayloadItem {
   dataKey: ChartValueKey
   value: number
}

type CustomTooltipProps = TooltipProps<number, ChartValueKey> & {
   payload?: TooltipPayloadItem[]
}

interface IProps {
   data: ITasksFlowSeries | undefined
}

const formatDay = (iso: string) => {
   const [, m, d] = iso.split("-")
   return `${d}.${m}`
}

const formatRange = (from: string, to: string) =>
   `${formatDay(from)} – ${formatDay(to)}`

const aggregateByWeek = (series: TasksFlowPoint[]): TasksFlowChartPoint[] => {
   const result: TasksFlowChartPoint[] = []

   for (let i = 0; i < series.length; i += 7) {
      const chunk = series.slice(i, i + 7)
      if (chunk.length === 0) continue

      result.push({
         label: formatRange(chunk[0].date, chunk[chunk.length - 1].date),
         created: chunk.reduce((s, d) => s + d.created, 0),
         completed: chunk.reduce((s, d) => s + d.completed, 0),
      })
   }

   return result
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
   const { t } = useTranslation()
   if (!active || !payload?.length) return null

   return (
      <div className="rounded-md border bg-foreground text-white dark:text-black p-2 shadow">
         <p className="font-medium">{label}</p>
         <p>{t("statistics.created")}: {payload[0].value}</p>
         <p>{t("statistics.completed")}: {payload[1].value}</p>
      </div>
   )
}

export const LineStatistics = ({ data }: IProps) => {
   const { t } = useTranslation()
   const [period, setPeriod] = useState<TPeriod>("month")

   const chartData = useMemo<TasksFlowChartPoint[]>(() => {
      const series = data?.series
      if (!Array.isArray(series)) return []

      const sorted = series.slice().sort((a, b) => a.date.localeCompare(b.date))

      if (period === "month") {
         return sorted.map((p) => ({
            label: formatDay(p.date),
            created: p.created,
            completed: p.completed,
         }))
      }

      return aggregateByWeek(sorted)
   }, [data, period])

   if (!chartData.length) return null

   return (
      <Card className="w-full">
         <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg">{t("statistics.lineChart")}</CardTitle>

            <div className="flex gap-2 text-sm">
               <button
                  onClick={() => setPeriod("month")}
                  className={period === "month" ? "font-semibold" : ""}
               >
                  {t("statistics.month")}
               </button>
               <button
                  onClick={() => setPeriod("week")}
                  className={period === "week" ? "font-semibold" : ""}
               >
                  {t("statistics.week")}
               </button>
            </div>
         </CardHeader>

         <CardContent>
            <ResponsiveContainer width="100%" height={300}>
               <LineChart data={chartData}>
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />

                  <Line type="monotone" dataKey="created" stroke="#2563eb" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="completed" stroke="#22c55e" strokeWidth={2} dot={false} />
               </LineChart>
            </ResponsiveContainer>
         </CardContent>
      </Card>
   )
}
