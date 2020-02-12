import React from 'react';
import ReactDOM from 'react-dom';

import Menu from './components/Menu';
import Input from './components/Input';
import ButtonsRow from './components/ButtonsRow';
import SelectRow from './components/SelectRow';
import InfoCard from './components/InfoCard';

import mockData from './mockData';
import './index.css';

import {
    TERMS_LOAN,
    TERMS_LEASE,
    MILEAGES,
    CREDIT_SCORE,
    TERMS_LOAN_DI,
    TERMS_LEASE_DI,
    MILEAGES_DI,
    CREDIT_SCORE_DI,
    bitDepth10,
    tabCode,
    firstTab,
    secondTab,
} from './consts';

import {
    loadInt,
    getCreditScoreValue,
    getLocation,
} from './utils';

class App extends React.Component {
    constructor(props) {
        super(props);
        const initial = 0;
        this.state = {
            currentTab: loadInt('currentTab') || firstTab,
            tradeIn: loadInt('tradeIn') || initial,
            downPayment: loadInt('downPayment') || initial,
            postCode: '',
            apr: loadInt('apr') || initial,
            termsLoanId: loadInt('termsLoanId') || TERMS_LOAN_DI,
            creditScoresLoanId: loadInt('creditScoresLoanId') || CREDIT_SCORE_DI,
            termsLeaseId: loadInt('termsLeaseId') || TERMS_LEASE_DI,
            mileagesId: loadInt('mileagesId') || MILEAGES_DI,
            creditScoresLeaseId: loadInt('creditScoresLeaseId') || CREDIT_SCORE_DI,
            calculations: {
                loan: {
                    finished: false,
                    value: initial,
                },
                lease: {
                    finished: false,
                    value: initial,
                }
            },
            infocard: {
                isLoaded: false,
                data: {},
            },
            downPaymentError: null,
            tradeInError: null,
        }
    }

    fetchPostCode = () => {
        getLocation()
            .then((data) => {
                this.setState({ postCode: data });
            })
    }

    fetchInfoCardData = () => {
        return Promise.resolve(mockData)
            .then((data) => {
                this.setState({
                    infocard: {
                        isLoaded: true,
                        data,
                    }
                });
            });
    }

    save = (name, value) => {
        this.setState({ [name]: value });
        localStorage.setItem(name, value);
    }

    RowHandler = (event) => {
        const { target } = event;
        const raw = target.getAttribute('data-index');
        const name = target.getAttribute('name');
        if (raw === null || name === null) return;
        const index = parseInt(raw, bitDepth10);
        this.save(name, index);
        this.calculate();
    }

    menuHandler = (event) => {
        const { target } = event;
        const raw = target.getAttribute('data-index');
        if (raw === null) return;
        const index = parseInt(raw, bitDepth10);
        this.save('currentTab', index);
    }

    inputHandler = (event) => {
        const { target } = event;
        const name = target.getAttribute('name');
        const value = parseInt(target.value, bitDepth10);
        if (name === null) return;
        if (Number.isNaN(value)) this.save(name, '');
        else this.save(name, value);
        this.calculate();
    }

    postCodeHandler = (event) => {
        const { target } = event;
        this.save('postCode', target.value);
    }

    countMonthlyPaymentLease = () => {
        return new Promise((resolve, reject) => {
            const {
                tradeIn,
                downPayment,
                termsLeaseId,
                creditScoresLeaseId,
                mileagesId,
                infocard,
            } = this.state;
            const { msrp } = infocard.data;
            if (!infocard.isLoaded) reject('infocard is not loaded');
            const mileage = MILEAGES[mileagesId];
            const term = TERMS_LEASE[termsLeaseId];
            const creditScore = CREDIT_SCORE[creditScoresLeaseId];
            const creditScoreValue = getCreditScoreValue(creditScore);
            const termMult = 10000;
            resolve((msrp - tradeIn - downPayment) * mileage / termMult / term * creditScoreValue);
        });
    }

    countMonthlyPaymentLoan = () => {
        return new Promise((resolve, reject) => {
            const {
                tradeIn,
                downPayment,
                termsLeaseId,
                apr,
                creditScoresLoanId,
                infocard,
            } = this.state;
            const { msrp } = infocard.data;
            if (!infocard.isLoaded) reject('infocard is not loaded');
            const term = TERMS_LEASE[termsLeaseId];
            const creditScore = CREDIT_SCORE[creditScoresLoanId];
            const creditScoreValue = getCreditScoreValue(creditScore);
            resolve((msrp - tradeIn - downPayment) * term * creditScoreValue * apr);
        });
    }

    calculate = () => {
        const {
            tradeIn,
            downPayment,
            infocard,
        } = this.state;
        if (!infocard.isLoaded) return;
        const { msrp } = infocard.data;
        const odf = 0.25;
        const msrpMax = msrp / odf;
        const message = 'payment should\'nt be bigger than:';
        let errored = false;
        const errors = {
            downPaymentError: null,
            tradeInError: null,
        };
        if (downPayment > msrpMax) {
            errored = true;
            errors.downPaymentError = `down payment ${message} ${msrpMax}$`;
        }
        if (tradeIn > msrpMax) {
            errored = true;
            errors.tradeInError = `trade in ${message} ${msrpMax}$`
        }
        if (errored) {
            this.setState({ ...errors });
            return;
        }
        this.countMonthlyPaymentLoan()
            .then((valueLoan) => {
                const loan = {
                    finished: true,
                    value: valueLoan,
                };
                this.countMonthlyPaymentLease()
                    .then((valueLease) => {
                        const lease = {
                            finished: true,
                            value: valueLease,
                        };
                        this.setState({
                            calculations: { lease, loan },
                            downPaymentError: null,
                            tradeInError: null,
                        });
                    })
            });
    }

    componentDidMount() {
        const loadTime = 100;
        setTimeout(() => {
            //to demonstrate the spinner
            this.fetchInfoCardData()
            .then(() => {
                this.calculate();
            })
            .then(() => {
                this.fetchPostCode();
            })
        }, loadTime)
        document.addEventListener('keydown', (event) => {
            if (event.keyCode === tabCode) {
                event.preventDefault();
                const { currentTab } = this.state;
                const tab = currentTab === firstTab ? secondTab : firstTab;
                this.save('currentTab', tab);
            }
        })
    }

    render() {
        const {
            currentTab,
            downPayment,
            tradeIn,
            apr,
            postCode,
            termsLoanId,
            creditScoresLoanId,
            termsLeaseId,
            mileagesId,
            creditScoresLeaseId,
            calculations,
            infocard,
            downPaymentError,
            tradeInError,
        } = this.state;
        const {
            isLoaded,
            data
        } = infocard;
        const { msrp } = data;
        const {
            loan,
            lease,
        } = calculations;
        const odf = 0.25;
        const msrpMax = msrp / odf;
        const pMult = 11;
        const taxesList = postCode ? postCode.split('').map((num) => num * pMult) : [];
        return (
            <div className='calculator-container'>
                <Menu
                    changeTab={this.menuHandler}
                    onTab={currentTab}
                    tabList={['loan', 'lease']}
                >
                    <div className='menu-common'>
                        <Input
                            name='downPayment'
                            onChange={this.inputHandler}
                            value={downPayment}
                            symbol='$'
                            preSymbol={true}
                            max={isLoaded ? msrpMax : undefined}
                            errorName={'downPaymentError'}
                            errorText={downPaymentError ? downPaymentError : undefined}
                        />
                        <Input
                            name='tradeIn'
                            onChange={this.inputHandler}
                            value={tradeIn}
                            symbol='$'
                            preSymbol={true}
                            max={isLoaded ? msrpMax : undefined}
                            errorName={'tradeInError'}
                            errorText={tradeInError ? tradeInError : undefined}
                        />
                    </div>
                    <div className='menu-loan'>
                        <Input
                            name='apr'
                            onChange={this.inputHandler}
                            value={apr}
                            symbol='%'
                            preSymbol={false}
                        />
                        <Input
                            name='postCode'
                            onChange={this.postCodeHandler}
                            value={postCode}
                            symbol='p'
                            preSymbol={false}
                            type='text'
                        />
                        <ButtonsRow
                            name='termsLoanId'
                            text='terms loan'
                            onClick={this.RowHandler}
                            data={TERMS_LOAN}
                            highlited={termsLoanId}
                        />
                        <ButtonsRow
                            name='creditScoresLoanId'
                            text='your credit score'
                            onClick={this.RowHandler}
                            data={CREDIT_SCORE}
                            highlited={creditScoresLoanId}
                        />
                        <span className='menu-info'>
                            loan: <span>{loan.finished && loan.value}</span>
                        </span>
                    </div>
                    <div className='menu-lease'>
                        <SelectRow
                            text='terms lease'
                            name='termsLeaseId'
                            onChange={this.RowHandler}
                            data={TERMS_LEASE}
                            highlited={termsLeaseId}
                        />
                        <SelectRow
                            text='mileages'
                            name='mileagesId'
                            onChange={this.RowHandler}
                            data={MILEAGES}
                            highlited={mileagesId}
                        />
                        <SelectRow
                            text='your credit score'
                            name='creditScoresLeaseId'
                            onChange={this.RowHandler}
                            data={CREDIT_SCORE}
                            highlited={creditScoresLeaseId}
                        />
                        <span className='menu-info'>
                            lease: <span>{lease.finished && lease.value}</span>
                        </span>
                    </div>
                </Menu>
                <InfoCard taxesList={taxesList} data={infocard} />
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('calculator'));