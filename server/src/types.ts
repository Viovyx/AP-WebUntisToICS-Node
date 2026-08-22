//#region App types
export interface ErrorRes {
    error: string;
}

export interface Class {
    id: number;
    name: string;
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

export interface CleanPositions {
    subjects: Position[];
    teachers: Position[];
    rooms: Position[];
    infos: Position[];
    classes: Position[];
}
//#endregion

//#region API response types
export interface SchoolData {
    currentSchoolYear: CurrentSchoolyear;
    departments: unknown[];
    isPLayground: unknown;
    oneDriveData: unknown;
    tenant: Tenant;
    ui2020: unknown;
    user: User;
    permissions: unknown[];
    settings: unknown[];
    pollingJobs: unknown[];
    isSupportAccessOpen: unknown;
    licenceExpiresAt: unknown;
    holidays: unknown[];
}

export interface Tenant {
    displayName: string;
    id: string;
    wuHostName: unknown;
    name: string;
}

export interface User {
    id: unknown;
    locale: string;
    name: unknown;
    email: unknown;
    permissions: {
        views: string[];
    };
    person: unknown;
    roles: unknown[];
    students: unknown[];
    lastLogin: unknown;
}

export interface SchoolYear {
    dateRange: DateRange;
    id: number;
    name: string;
}

export interface CurrentSchoolyear extends SchoolYear {
    timeGrid: {
        schoolyearId: number;
        units: {
            endTime: number;
            startTime: number;
            unitOfDay: number;
        }[];
    };
}

export interface DateRange {
    start: string;
    end: string;
}

export interface Resource {
    resourceType: string;
    preSelected: unknown;
    buidlings: unknown[];
    departments: ResourceEl[];
    roomGroups: unknown[];
    resourceTypes: unknown[];
    assignmentGroups: unknown[];
    classes: ClassResource[];
    resources: unknown[];
    rooms: unknown[];
    subjects: unknown[];
    students: unknown[];
    teachers: unknown[];
}

export interface ResourceEl {
    id: number;
    shortName: string;
    longName: string;
    displayName: string;
}

export interface ClassResource {
    class: ResourceEl;
    classTeacher1: unknown;
    classTeacher2: unknown;
    department: ResourceEl;
}

export interface Timetable {
    format: number;
    days: Day[];
    errors: unknown[];
}

export interface Day {
    date: string;
    resourceType: string;
    resource: ResourceEl;
    status: string;
    dayEntries: unknown[];
    gridEntries: GridEntry[];
    backEntries: unknown[];
}

export interface GridEntry {
    ids: number[];
    duration: DateRange;
    type: string;
    status: string;
    statusDetail: unknown;
    name: unknown;
    layoutStartPosition: number;
    layoutWidth: number;
    layoutGroup: number;
    color: string;
    notesAll: string;
    icons: unknown[];
    position1: Position[] | undefined;
    position2: Position[] | undefined;
    position3: Position[] | undefined;
    position4: Position[] | undefined;
    position5: Position[] | undefined;
    position6: Position[] | undefined;
    position7: Position[] | undefined;
    texts: unknown[];
    lessonText: unknown;
    lessonInfo: string;
    substitutionText: string;
    userName: unknown;
    moved: unknown;
    durationTotal: unknown;
    link: unknown;
}

export interface Position {
    current: {
        type: "SUBJECT" | "TEACHER" | "ROOM" | "INFO" | "CLASS";
        status: string;
        shortName: string;
        longName: string;
        displayName: string;
        displayNameLabel: string;
    };
    removed: unknown;
}
//#endregion
