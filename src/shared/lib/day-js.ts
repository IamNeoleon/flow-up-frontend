import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import i18n from "@/config/i18n/i18n"
import isToday from "dayjs/plugin/isToday"
import isYesterday from "dayjs/plugin/isYesterday"
import "dayjs/locale/ru"
import "dayjs/locale/en"

dayjs.extend(isToday)
dayjs.extend(isYesterday)
dayjs.extend(relativeTime)

dayjs.locale(i18n.resolvedLanguage)

i18n.on("languageChanged", (lng) => {
   dayjs.locale(lng)
})

export default dayjs
