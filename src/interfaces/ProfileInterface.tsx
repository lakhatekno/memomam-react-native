export interface ProfileSummary {
  name: string;
  statistics: {
    sarapan: number;
    makan_siang: number;
    makan_malam: number;
    camilan: number;
  };
  most_eaten: string;
}