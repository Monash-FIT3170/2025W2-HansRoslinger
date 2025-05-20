export type ActionType = "move" | "resize" | "hover";

export type VisualPosition = { x: number; y: number };

export interface InteractionInput {
  type: ActionType;
  position: VisualPosition;
  targetId?: string;
  isHovered?: boolean; 
}
