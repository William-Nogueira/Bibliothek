export interface Loan {
    id: string;
    bookTitle: string;
    userRegistration: string;
    userName: string;
    status: 'PENDING' | 'ACTIVE' | 'FINISHED' | 'RENEWED';
    requestDate: string;
    loanDate?: string;
    returnDate?: string;
    fine: number;
}
