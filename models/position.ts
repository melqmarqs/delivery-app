export interface EventPosition {
  title: string,
  description: string,
  position?: string
}

export interface RoutePositions {
  first: PositionDetail;
  second: PositionDetail;
  third: PositionDetail;
}

export interface PositionDetail {
  row: number;
  column: string;
  color?: string;
  defaultColor?: string;
}

export interface FieldValidation {
  value: string;
  error: boolean;
}