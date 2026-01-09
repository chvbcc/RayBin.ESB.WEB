/**
 * Validate date strings in formats:
 * - yyyy-MM-dd, yyyy-M-d, yyyy-MM-d, yyyy-M-dd
 * - yyyy/MM/dd, yyyy/M/d, yyyy/MM/d, yyyy/M/dd
 * - dd/MM/yyyy, d/M/yyyy, dd/M/yyyy, d/MM/yyyy
 * - Any of the above + " HH:mm:ss"
 * - Any of the above + ISO time part: "T HH:mm:ss[.SSS][Z|±HH:mm]"
 */
export function isValidDate(dateString: string): boolean {
  if (typeof dateString !== 'string') return false;
  const input = dateString.trim();
  if (!input) return false;

  // 解析ISO时间部分（包含毫秒、时区校验）
  let timeFromIso: { h: number; m: number; s: number; ms: number } | null = null;
  let datePart = input;
  const isoTimeRegex = /T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(Z|[+-]\d{2}:?\d{2})?$/;
  const isoMatch = input.match(isoTimeRegex);

  if (isoMatch) {
    const idx = isoMatch.index ?? input.lastIndexOf('T');
    datePart = input.slice(0, idx);

    // 提取并校验时分秒（增加非空校验）
    const hoursStr = isoMatch[1];
    const minutesStr = isoMatch[2];
    const secondsStr = isoMatch[3];
    const msStr = isoMatch[4];
    const tzStr = isoMatch[5];

    // 非空校验：缺少时分秒则直接返回false
    if (!hoursStr || !minutesStr || !secondsStr) return false;

    const h = parseInt(hoursStr, 10);
    const m = parseInt(minutesStr, 10);
    const s = parseInt(secondsStr, 10);
    if (h > 23 || m > 59 || s > 59) return false;

    // 校验毫秒（0-999）
    const ms = msStr ? parseInt(msStr.padEnd(3, '0'), 10) : 0; // 补零到3位（如 .1 → 10ms）
    if (ms > 999) return false;

    // 校验时区格式（Z 或 ±HH:mm，小时≤14，分钟≤59）
    if (tzStr && tzStr !== 'Z') {
      const tzMatch = tzStr.match(/([+-])(\d{2}):?(\d{2})?/);
      if (!tzMatch) return false;
      const tzHStr = tzMatch[2];
      const tzMStr = tzMatch[3] || '0';
      
      // 时区部分非空校验
      if (!tzHStr) return false;
      
      const tzH = parseInt(tzHStr, 10);
      const tzM = parseInt(tzMStr, 10);
      if (tzH > 14 || tzM > 59) return false;
    }

    timeFromIso = { h, m, s, ms };
  }

  // 优化正则：限制月份/日期为 1-2位（排除00开头但非0的情况）
  const patterns: RegExp[] = [
    /^(?<y>\d{4})[-/](?<m>0?[1-9]|1[0-2])[-/](?<d>0?[1-9]|[12]\d|3[01])(?:\s+(?<hh>\d{1,2}):(?<mm>\d{1,2}):(?<ss>\d{1,2}))?$/,
    /^(?<d>0?[1-9]|[12]\d|3[01])\/(?<m>0?[1-9]|1[0-2])\/(?<y>\d{4})(?:\s+(?<hh>\d{1,2}):(?<mm>\d{1,2}):(?<ss>\d{1,2}))?$/,
  ];

  for (const pattern of patterns) {
    const match = datePart.match(pattern);
    if (!match?.groups) continue;

    const { y, m: monStr, d: dayStr, hh, mm, ss } = match.groups;
    // 核心非空校验：年/月/日缺一不可
    if (!y || !monStr || !dayStr) continue;

    // 转换为数字
    const year = parseInt(y, 10);
    const month = parseInt(monStr, 10);
    const day = parseInt(dayStr, 10);

    // 时间参数（优先ISO时间，其次空格时间，默认0）
    let hours = 0, minutes = 0, seconds = 0, ms = 0;
    if (timeFromIso) {
      ({ h: hours, m: minutes, s: seconds, ms } = timeFromIso);
    } else if (hh && mm && ss) {
      // 确保时分秒都存在且为有效数字
      hours = parseInt(hh, 10);
      minutes = parseInt(mm, 10);
      seconds = parseInt(ss, 10);
      if (hours > 23 || minutes > 59 || seconds > 59) return false;
    }

    // 基础范围校验
    if (month < 1 || month > 12) return false;
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) return false;

    // 最终验证：防止日期溢出（如2024-02-30）
    const testDate = new Date(year, month - 1, day, hours, minutes, seconds, ms);
    if (
      testDate.getFullYear() === year &&
      testDate.getMonth() === month - 1 &&
      testDate.getDate() === day &&
      testDate.getHours() === hours &&
      testDate.getMinutes() === minutes &&
      testDate.getSeconds() === seconds &&
      testDate.getMilliseconds() === ms
    ) {
      return true;
    }
  }
  return false;
}