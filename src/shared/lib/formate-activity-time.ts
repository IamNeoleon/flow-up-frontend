import dayjs from "./day-js"

export const formatActivityTime = (date: string) => {
    const now = dayjs()
    const created = dayjs(date)

    const diffInHours = now.diff(created, "hour")

    if (now.diff(created, "day") === 1) {
        return "вчера"
    }

    if (diffInHours >= 24) {
        return created.format("DD.MM.YYYY HH:mm")
    }

    return created.fromNow()
}