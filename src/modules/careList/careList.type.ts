export enum CareListLoadingType {
  InitialLoad,
  Reload,
  LoadMore,
}

export interface TooltipImperativeHandle {
  displayTooltip: () => void;
}
