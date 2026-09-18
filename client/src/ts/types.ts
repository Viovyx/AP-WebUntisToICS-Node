export interface Class {
    id: number;
    name: string;
}

export interface SchoolYear {
    dateRange: DateRange;
    id: number;
    name: string;
}

export interface DateRange {
    start: string;
    end: string;
}
