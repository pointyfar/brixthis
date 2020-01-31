export interface WidgetItem {
    widgetName: string;
    name: string;
    label: string;
    class: string;
    inputType: string;
    flex?: number;
    icon?: string;
    formConfig?: string;
    children?: WidgetItem[];
    result?: {};
    group?: string;

    svg?: string;
    draggable?: string;
    droppable?: string;
    removeOnSpill?: boolean;
    removeable?: boolean;
    image?: string;
    content?: string;

}
 