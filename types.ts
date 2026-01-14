export interface InteractableProps {
  onClick?: () => void;
  onHover?: (isHovered: boolean) => void;
  active?: boolean;
}
