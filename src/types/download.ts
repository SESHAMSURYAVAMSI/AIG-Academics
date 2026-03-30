export type DownloadItem = {
  id: number;
  title: string;
  file: string; // base64
  fileName: string;
  active: boolean;
};

export type DownloadFormType = {
  title: string;
  file: string;
  fileName: string;
  active: boolean;
};