export function getTimeAgoParams(dateString: string): {
  key: string;
  values?: Record<string, number>;
  fallbackDate?: string;
} {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return { key: "justNow" };
  if (diffMins < 60) return { key: "minutesAgo", values: { minutes: diffMins } };
  if (diffHours < 24) return { key: "hoursAgo", values: { hours: diffHours } };
  if (diffDays < 7) return { key: "daysAgo", values: { days: diffDays } };
  return { key: "fallback", fallbackDate: date.toLocaleDateString() };
}
