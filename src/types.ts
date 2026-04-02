export interface Class {
    id: number;
    name: string;
}

export interface Day {
    date: string;
    entries: Lesson[];
}

export interface Lesson {
    start: Date;
    end: Date;
    info: string;
    teacher: string;
    subject: string;
    locations: string[];
    classes: string[];
}

// API interfaces
export interface ResourceData {
    resourceType: string;
    departments: ResourceEl[];
    classes: {
        class: ResourceEl;
        department: ResourceEl;
    }[];
}

export interface ResourceEl {
    id: number;
    shortName: string;
    longName: string;
    displayName: string;
}

export interface SchoolInfo {
    currentSchoolYear: Schoolyear;
    tenant: {
        displayName: string;
        name: string;
    };
}

export interface Schoolyear {
    dateRange: DateRange;
    id: number;
    name: string;
}

export interface DateRange {
    start: string;
    end: string;
}

export interface TimeTable {
    days: {
        date: string;
        resource: ResourceEl;
        gridEntries: GridEntry[];
    }[];
}

export interface GridEntry {
    duration: DateRange;
    position1: GridEntryPos[];
    position2: GridEntryPos[];
    position3: GridEntryPos[];
    position4: GridEntryPos[];
    position5: GridEntryPos[];
    lessonInfo: string;
}

export interface GridEntryPos {
    current: {
        type: string;
        shortName: string;
        longName: string;
        displayName: string;
    };
}
