/**
 * locale.ts
 * 캘린더 로케일 정의
 *
 * @license MIT
 * @copyright 2025 김영진 (Kim Young Jin)
 * @author 김영진 (ehfuse@gmail.com)
 */

/** 캘린더 로케일 타입 (텍스트 커스터마이징) */
export interface CalendarLocale {
    weekdays: [string, string, string, string, string, string, string]; // 요일 (일~토)
    months: [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string
    ]; // 월 (1~12월)
    today: string; // 오늘 버튼
    confirm: string; // 확인 버튼
    cancel: string; // 취소 버튼
    close: string; // 닫기 버튼
}

/** 캘린더 텍스트 타입 (부분 커스터마이징용) */
export type CalendarTexts = Partial<CalendarLocale>;

/** 한국어 로케일 */
export const koLocale: CalendarLocale = {
    weekdays: ["일", "월", "화", "수", "목", "금", "토"],
    months: [
        "1월",
        "2월",
        "3월",
        "4월",
        "5월",
        "6월",
        "7월",
        "8월",
        "9월",
        "10월",
        "11월",
        "12월",
    ],
    today: "오늘",
    confirm: "확인",
    cancel: "취소",
    close: "닫기",
};

/** 영어 로케일 */
export const enLocale: CalendarLocale = {
    weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    months: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ],
    today: "Today",
    confirm: "OK",
    cancel: "Cancel",
    close: "Close",
};

/** 일본어 로케일 */
export const jaLocale: CalendarLocale = {
    weekdays: ["日", "月", "火", "水", "木", "金", "土"],
    months: [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月",
    ],
    today: "今日",
    confirm: "確認",
    cancel: "キャンセル",
    close: "閉じる",
};

/** 중국어 간체 로케일 */
export const zhCNLocale: CalendarLocale = {
    weekdays: ["日", "一", "二", "三", "四", "五", "六"],
    months: [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月",
    ],
    today: "今天",
    confirm: "确认",
    cancel: "取消",
    close: "关闭",
};

/** 중국어 번체 로케일 */
export const zhTWLocale: CalendarLocale = {
    weekdays: ["日", "一", "二", "三", "四", "五", "六"],
    months: [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月",
    ],
    today: "今天",
    confirm: "確認",
    cancel: "取消",
    close: "關閉",
};

/** 스페인어 로케일 */
export const esLocale: CalendarLocale = {
    weekdays: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
    months: [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
    ],
    today: "Hoy",
    confirm: "Aceptar",
    cancel: "Cancelar",
    close: "Cerrar",
};

/** 프랑스어 로케일 */
export const frLocale: CalendarLocale = {
    weekdays: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
    months: [
        "Jan",
        "Fév",
        "Mar",
        "Avr",
        "Mai",
        "Juin",
        "Juil",
        "Aoû",
        "Sep",
        "Oct",
        "Nov",
        "Déc",
    ],
    today: "Aujourd'hui",
    confirm: "OK",
    cancel: "Annuler",
    close: "Fermer",
};

/** 독일어 로케일 */
export const deLocale: CalendarLocale = {
    weekdays: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
    months: [
        "Jan",
        "Feb",
        "Mär",
        "Apr",
        "Mai",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Okt",
        "Nov",
        "Dez",
    ],
    today: "Heute",
    confirm: "OK",
    cancel: "Abbrechen",
    close: "Schließen",
};

/** 포르투갈어 로케일 */
export const ptLocale: CalendarLocale = {
    weekdays: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
    months: [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
    ],
    today: "Hoje",
    confirm: "OK",
    cancel: "Cancelar",
    close: "Fechar",
};

/** 러시아어 로케일 */
export const ruLocale: CalendarLocale = {
    weekdays: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    months: [
        "Янв",
        "Фев",
        "Мар",
        "Апр",
        "Май",
        "Июн",
        "Июл",
        "Авг",
        "Сен",
        "Окт",
        "Ноя",
        "Дек",
    ],
    today: "Сегодня",
    confirm: "ОК",
    cancel: "Отмена",
    close: "Закрыть",
};

/** 이탈리아어 로케일 */
export const itLocale: CalendarLocale = {
    weekdays: ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"],
    months: [
        "Gen",
        "Feb",
        "Mar",
        "Apr",
        "Mag",
        "Giu",
        "Lug",
        "Ago",
        "Set",
        "Ott",
        "Nov",
        "Dic",
    ],
    today: "Oggi",
    confirm: "OK",
    cancel: "Annulla",
    close: "Chiudi",
};

/** 아랍어 로케일 */
export const arLocale: CalendarLocale = {
    weekdays: ["أحد", "إثن", "ثلا", "أرب", "خمي", "جمع", "سبت"],
    months: [
        "يناير",
        "فبراير",
        "مارس",
        "أبريل",
        "مايو",
        "يونيو",
        "يوليو",
        "أغسطس",
        "سبتمبر",
        "أكتوبر",
        "نوفمبر",
        "ديسمبر",
    ],
    today: "اليوم",
    confirm: "موافق",
    cancel: "إلغاء",
    close: "إغلاق",
};

/** 힌디어 로케일 */
export const hiLocale: CalendarLocale = {
    weekdays: ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"],
    months: [
        "जन",
        "फर",
        "मार्च",
        "अप्रै",
        "मई",
        "जून",
        "जुला",
        "अग",
        "सित",
        "अक्टू",
        "नव",
        "दिस",
    ],
    today: "आज",
    confirm: "ठीक",
    cancel: "रद्द",
    close: "बंद",
};

/** 베트남어 로케일 */
export const viLocale: CalendarLocale = {
    weekdays: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
    months: [
        "Th1",
        "Th2",
        "Th3",
        "Th4",
        "Th5",
        "Th6",
        "Th7",
        "Th8",
        "Th9",
        "Th10",
        "Th11",
        "Th12",
    ],
    today: "Hôm nay",
    confirm: "OK",
    cancel: "Hủy",
    close: "Đóng",
};

/** 태국어 로케일 */
export const thLocale: CalendarLocale = {
    weekdays: ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"],
    months: [
        "ม.ค.",
        "ก.พ.",
        "มี.ค.",
        "เม.ย.",
        "พ.ค.",
        "มิ.ย.",
        "ก.ค.",
        "ส.ค.",
        "ก.ย.",
        "ต.ค.",
        "พ.ย.",
        "ธ.ค.",
    ],
    today: "วันนี้",
    confirm: "ตกลง",
    cancel: "ยกเลิก",
    close: "ปิด",
};

/** 인도네시아어 로케일 */
export const idLocale: CalendarLocale = {
    weekdays: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
    months: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Agu",
        "Sep",
        "Okt",
        "Nov",
        "Des",
    ],
    today: "Hari ini",
    confirm: "OK",
    cancel: "Batal",
    close: "Tutup",
};

/** 네덜란드어 로케일 */
export const nlLocale: CalendarLocale = {
    weekdays: ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"],
    months: [
        "Jan",
        "Feb",
        "Mrt",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Okt",
        "Nov",
        "Dec",
    ],
    today: "Vandaag",
    confirm: "OK",
    cancel: "Annuleren",
    close: "Sluiten",
};

/** 폴란드어 로케일 */
export const plLocale: CalendarLocale = {
    weekdays: ["Nd", "Pn", "Wt", "Śr", "Cz", "Pt", "So"],
    months: [
        "Sty",
        "Lut",
        "Mar",
        "Kwi",
        "Maj",
        "Cze",
        "Lip",
        "Sie",
        "Wrz",
        "Paź",
        "Lis",
        "Gru",
    ],
    today: "Dziś",
    confirm: "OK",
    cancel: "Anuluj",
    close: "Zamknij",
};

/** 터키어 로케일 */
export const trLocale: CalendarLocale = {
    weekdays: ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"],
    months: [
        "Oca",
        "Şub",
        "Mar",
        "Nis",
        "May",
        "Haz",
        "Tem",
        "Ağu",
        "Eyl",
        "Eki",
        "Kas",
        "Ara",
    ],
    today: "Bugün",
    confirm: "Tamam",
    cancel: "İptal",
    close: "Kapat",
};

/** 기본 로케일 (한국어) */
export const defaultLocale = koLocale;

/** 로케일 맵 */
export const locales = {
    ko: koLocale,
    en: enLocale,
    ja: jaLocale,
    zhCN: zhCNLocale,
    zhTW: zhTWLocale,
    es: esLocale,
    fr: frLocale,
    de: deLocale,
    pt: ptLocale,
    ru: ruLocale,
    it: itLocale,
    ar: arLocale,
    hi: hiLocale,
    vi: viLocale,
    th: thLocale,
    id: idLocale,
    nl: nlLocale,
    pl: plLocale,
    tr: trLocale,
} as const;

/** 로케일 키 타입 */
export type LocaleKey = keyof typeof locales;

/** 로케일 프롭 타입 (객체 또는 문자열) */
export type LocaleProp = CalendarLocale | LocaleKey;

/**
 * 로케일 프롭을 CalendarLocale 객체로 변환
 * @param locale - CalendarLocale 객체 또는 로케일 키 문자열 (예: 'ko', 'en')
 * @returns CalendarLocale 객체
 */
export function resolveLocale(locale: LocaleProp | undefined): CalendarLocale {
    if (!locale) return defaultLocale;
    if (typeof locale === "string") {
        return locales[locale] ?? defaultLocale;
    }
    return locale;
}
