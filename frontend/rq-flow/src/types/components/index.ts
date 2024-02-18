import { ForwardRefExoticComponent, ReactElement, ReactNode } from "react";
import { NodeDataType } from "../flow/index";
export type InputComponentType = {
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  password: boolean;
};
export type ToggleComponentType = {
  enabled: boolean;
  setEnabled: (state: boolean) => void;
  disabled: boolean;
};
export type DropDownComponentType = {
  value: string;
  options: string[];
  onSelect: (value: string) => void;
};
export type ParameterComponentType = {
  data: NodeDataType;
  title: string;
  id: string;
  color: string;
  left: boolean;
  type: string;
  required?: boolean;
  name?: string;
  tooltipTitle: string;
};
export type InputListComponentType = {
  value: string[];
  onChange: (value: string[]) => void;
  disabled: boolean;
};

export type TextAreaComponentType = {
  disabled: boolean;
  onChange: (value: string[] | string) => void;
  value: string;
};

export type FileComponentType = {
  disabled: boolean;
  onChange: (value: string[] | string) => void;
  value: string;
  suffixes: Array<string>;
  fileTypes: Array<string>;
  onFileChange: (value: string) => void;
};

export type DisclosureComponentType = {
  children: ReactNode;
  button: {
    title: string;
    Icon: ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
    buttons?: {
      Icon: ReactElement;
      title: string;
      onClick: (event?: React.MouseEvent) => void;
    }[];
  };
};
export type FloatComponentType = {
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

export type TooltipComponentType = {
  children: ReactElement;
  title: string;
  placement?:
    | "bottom-end"
    | "bottom-start"
    | "bottom"
    | "left-end"
    | "left-start"
    | "left"
    | "right-end"
    | "right-start"
    | "right"
    | "top-end"
    | "top-start"
    | "top";
};
