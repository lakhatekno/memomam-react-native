// export function ConvertTimeToTimezone(time: string, fromGMT: number, toGMT: number): string {
//   const [hour, minute] = time.split(':').map(Number);
//   const date = new Date();
//   date.setUTCHours(hour - fromGMT + toGMT, minute, 0, 0);
//   const h = date.getHours().toString().padStart(2, '0');
//   const m = date.getMinutes().toString().padStart(2, '0');
//   return `${h}:${m}`;
// }

export const ConvertTimeToTimezone = (time: string, fromGmt: number, toGmt: number): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const gmtDifference = toGmt - fromGmt;

  let newHours = (hours + gmtDifference) % 24;
  if (newHours < 0) {
    newHours += 24;
  }

  const formattedHours = String(newHours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}`;
};