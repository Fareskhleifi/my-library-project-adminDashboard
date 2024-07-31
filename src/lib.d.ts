declare module '*.svg' {
  const content: any;
  export default content;
}
import * as jsPDF from 'jspdf';

declare module 'jspdf-autotable' {
  export = jsPDF;
  export interface AutoTableOptions {
    startY?: number;
    head?: any[][];
    body?: any[][];
    theme?: 'striped' | 'grid' | 'plain';
  }
  declare function autoTable(doc: jsPDF, options: AutoTableOptions): void;
  export = autoTable;
}