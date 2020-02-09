export const TERMS_LOAN = [12, 24, 36, 48, 72, 84];
export const TERMS_LEASE = [24, 36, 48];
export const MILEAGES = [10000, 12000, 15000];
export const CREDIT_SCORE_OBJECT = Object.freeze({
    from: 600,
    to: 900,
    step: 50,
    getCreditScore: function() {
        const {
            from,
            to,
            step,
        } = this;
        const list = [];
        for (let cs = from; cs < to; cs += step) {
            list.push(cs);
        }
        return list;
    }
});

export const CREDIT_SCORE = CREDIT_SCORE_OBJECT.getCreditScore();
export const TERMS_LOAN_NAME = 'TERMS_LOAN_NAME';
export const TERMS_LEASE_NAME = 'TERMS_LEASE_NAME';
export const MILEAGES_NAME = 'MILEAGES_NAME';
export const CREDIT_SCORE_NAME = 'CREDIT_SCORE_NAME';
export const TERMS_LOAN_DI = 1;
export const TERMS_LEASE_DI = 1;
export const MILEAGES_DI = 1;
export const CREDIT_SCORE_DI = 1;
export const bitDepth10 = 10;
export const tabCode = 9;
export const firstTab = 0;
export const secondTab = 1;
