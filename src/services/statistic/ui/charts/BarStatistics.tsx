import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import {
   BarChart,
   XAxis,
   YAxis,
   Tooltip,
   ResponsiveContainer,
   Bar,
   CartesianGrid,
   type TooltipProps,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/shadcn/card"
import type {
   ITaskCumulativeSeries,
   TaskCumulativeChartPoint,
   ITaskCumulativePoint,
} from "../../types"

type TPeriod = "month" | "week"

type ChartValueKey = "completed" | "remaining"

interface TooltipPayloadItem {
   dataKey: ChartValueKey
   value: number
}

type CustomTooltipProps = TooltipProps<number, ChartValueKey> & {
   payload?: TooltipPayloadItem[]
}

interface IProps {
   data: ITaskCumulativeSeries | undefined
}

const formatDay = (iso: string) => {
   const [, m, d] = iso.split("-")
   return `${d}.${m}`
}

const formatRange = (from: string, to: string) =>
   `${formatDay(from)} – ${formatDay(to)}`

const toChartPointDay = (p: ITaskCumulativePoint): TaskCumulativeChartPoint => {
   const remaining = Math.max(0, p.all - p.completed)
   return {
      label: formatDay(p.date),
      all: p.all,
      completed: p.completed,
      remaining,
   }
}

const aggregateCumulativeByWeek = (series: ITaskCumulativePoint[]): TaskCumulativeChartPoint[] => {
   const result: TaskCumulativeChartPoint[] = []

   for (let i = 0; i < series.length; i += 7) {
      const chunk = series.slice(i, i + 7)
      if (chunk.length === 0) continue

      const last = chunk[chunk.length - 1]
      const remaining = Math.max(0, last.all - last.completed)

      result.push({
         label: formatRange(chunk[0].date, last.date),
         all: last.all,
         completed: last.completed,
         remaining,
      })
   }

   return result
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
   const { t } = useTranslation()
   if (!active || !payload?.length) return null

   const completed = payload.find((p) => p.dataKey === "completed")?.value ?? 0
   const remaining = payload.find((p) => p.dataKey === "remaining")?.value ?? 0
   const all = completed + remaining

   return (
      <div className="rounded-md border bg-foreground text-white dark:text-black p-2 shadow">
         <p className="font-medium">{label}</p>
         <p>{t("statistics.all")}: {all}</p>
         <p>{t("statistics.completed")}: {completed}</p>
         <p>{t("statistics.remaining")}: {remaining}</p>
      </div>
   )
}

export const BarStatistics = ({ data }: IProps) => {
   const { t } = useTranslation()
   const [period, setPeriod] = useState<TPeriod>("month")

   const chartData = useMemo<TaskCumulativeChartPoint[]>(() => {
      const series = data?.series
      if (!Array.isArray(series)) return []

      const sorted = series.slice().sort((a, b) => a.date.localeCompare(b.date))

      if (period === "month") {
         return sorted.map(toChartPointDay)
      }

      return aggregateCumulativeByWeek(sorted)
   }, [data, period])

   if (!chartData.length) return null

   return (
      <div className="w-full pt-10">
         <Card className="w-full">
            <CardHeader className="flex items-center justify-between">
               <CardTitle className="text-lg">{t("statistics.barChart")}</CardTitle>
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
                  <BarChart data={chartData}>
                     <CartesianGrid vertical={false} />
                     <XAxis dataKey="label" />
                     <YAxis />
                     <Tooltip content={<CustomTooltip />} />

                     <Bar dataKey="completed" stackId="a" fill="#2563eb" />
                     <Bar dataKey="remaining" stackId="a" fill="#60a5fa" radius={[6, 6, 0, 0]} />
                  </BarChart>
               </ResponsiveContainer>
            </CardContent>
         </Card>
      </div>
   )
}
