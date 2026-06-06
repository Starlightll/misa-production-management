export type Shift = {
    shiftId: string;
    shiftCode: string;
    shiftName: string;
    shiftDescription: string;
    shiftBeginTime: string;
    shiftEndTime: string;
    shiftBeginBreakTime: string | null;
    shiftEndBreakTime: string | null;
    shiftWorkingTime: number;
    shiftBreakingTime: number;
    shiftInactive: boolean;
    createdBy: string;
    createdDate: string;
    modifiedBy: string;
    modifiedDate: string;
}