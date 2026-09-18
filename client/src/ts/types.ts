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

export interface Lesson {
    start: Date;
    end: Date;
    info: string;
    teachers: string[];
    subject: string;
    locations: string[];
    classes: string[];
}
