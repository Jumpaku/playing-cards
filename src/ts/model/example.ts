export type Example = {
  value: {
    str: string;
    num: number;
  };
  createTime: Date;
  updateTime: Date;
};
export const examples = new Map<string, Example>();
