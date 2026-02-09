export interface IStatResponse {
   flow: ITasksFlowSeries,
   cumulative: ITaskCumulativeSeries
}

export interface TasksFlowPoint {
   date: string // "YYYY-MM-DD"
   created: number
   completed: number
}

export interface ITasksFlowSeries {
   interval: "day" | "week" | "month"
   from: string
   to: string
   series: TasksFlowPoint[]
}

export interface ITaskCumulativeSeries {
   interval: string;
   from: string;
   to: string;
   series: ITaskCumulativePoint[]
}

export interface ITaskCumulativePoint {
   date: string;
   all: number;
   completed: number;
}

export interface TaskCumulativeChartPoint {
   label: string
   all: number
   completed: number
   remaining: number
}

// то, что реально рисует Recharts:
export interface TasksFlowChartPoint {
   label: string
   created: number
   completed: number
}
