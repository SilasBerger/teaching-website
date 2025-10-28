export const checkExcelFormulaAnswer = (val: string, solutions: string[]) => {
    if (!val) {
        return false;
    }
    return solutions.some((solution: string) => solution === val);
};