export type AcademicDisplayAdapter = {
  render: (source: string, target: HTMLElement) => void;
};

export const textAcademicDisplayAdapter: AcademicDisplayAdapter = {
  render(source, target) {
    target.textContent = source;
  },
};
