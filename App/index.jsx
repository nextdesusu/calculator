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
    CREDIT_SCORE_DV,
} from './consts';

const bitDepth10 = 10;

const loadInt = (item) => parseInt(localStorage.getItem(item), bitDepth10);
const getCreditScoreValue = (creditScore) => {
    if (creditScore >= 750) {
        return 0.95;
    }
    if (creditScore >= 700 && creditScore < 750) {
        return 1;
    }
    if (creditScore >= 640 && creditScore < 700) {
        return 1.05;
    }
    if (creditScore < 640) {
        return 1.2;
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTab: loadInt('currentTab') || 0,
            tradeIn: loadInt('tradeIn') || 0,
            downPayment: loadInt('downPayment') || 0,
            postCode: loadInt('postCode') || 0,
            apr: loadInt('apr') || 0,
            termsLoanId: loadInt('termsLoanId') || TERMS_LOAN_DI,
            creditScoresLoanId: loadInt('creditScoresLoanId') || 0,
            termsLeaseId: loadInt('termsLeaseId') || TERMS_LEASE_DI,
            mileagesId: loadInt('mileagesId') || MILEAGES_DI,
            creditScoresLeaseId: loadInt('creditScoresLeaseId') || 0,
            isCalculated: false,
            errored: false,
            infocard: {
                isLoaded: false,
                data: {},
            }
        }
    }

    fetchInfoCardData = () => {
        return Promise.resolve(mockData)
            .then((data) => {
                console.log('loaded', data)
                this.setState({ infocard: {
                    isLoaded: true,
                    data,
                }});
            });
    }

    calculate = () => {
        Promise.resolve(this.countMonthlyPaymentLease())
            .then((lease) => {
                Promise.resolve(this.countMonthlyPaymentLoan())
                    .then((loan) => {
                        console.log('lease', lease);
                        console.log('loan', loan)
                    })
            })
    }

    componentDidMount() {
        this.fetchInfoCardData()
            .then(() => {
                this.calculate();
            })
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
    }

    countMonthlyPaymentLease = () => {
        const {
            tradeIn,
            downPayment,
            termsLeaseId,
            creditScoresLoanId,
            mileagesId,
            infocard,
        } = this.state;
        const mileage = MILEAGES[mileagesId];
        const term = TERMS_LEASE[termsLeaseId];
        const creditScore = this.creditScoresList[creditScoresLoanId];
        const creditScoreValue = getCreditScoreValue(creditScore);
        const { msrp } = infocard.data;
        const termMult = 10000;
        const result = (msrp - tradeIn - downPayment) * mileage / termMult / term * creditScoreValue;
        console.log(mileage)
        return result;
    }

    countMonthlyPaymentLoan = () => {
        const {
            tradeIn,
            downPayment,
            termsLeaseId,
            apr,
            creditScoresLoanId,
            infocard,
        } = this.state;
        const { msrp } = infocard.data;
        const term = TERMS_LEASE[termsLeaseId];
        const creditScore = this.creditScoresList[creditScoresLoanId];
        const creditScoreValue = getCreditScoreValue(creditScore);
        const result = (msrp - tradeIn - downPayment) * term * creditScoreValue * apr;
        return result;
    }

    get creditScoresList() {
        const {
            from,
            to,
            step,
        } = CREDIT_SCORE;
        const list = [];
        for (let cs = from; cs < to; cs += step) {
            list.push(cs);
        }
        return list;
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
            infocard,
        } = this.state;
        const {
            isLoaded,
            data
        } = infocard;
        const { msrp } = data;
        return(
            <div>
                <Menu changeTab={this.menuHandler} onTab={currentTab} tabList={['loan', 'lease']}>
                    <div className='menu-common'>
                        <Input
                            name='downPayment'
                            onChange={this.inputHandler}
                            value={downPayment}
                            symbol='$'
                            preSymbol={true}
                            max={isLoaded ? msrp * 0.25 : undefined}
                            errorText='value bigger than msrp!'
                        />
                        <Input
                            name='tradeIn'
                            onChange={this.inputHandler}
                            value={tradeIn}
                            symbol='$'
                            preSymbol={true}
                            max={isLoaded ? msrp * 0.25 : undefined}
                            errorText='value bigger than msrp!'
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
                            onChange={this.inputHandler}
                            value={postCode}
                            symbol='p'
                            preSymbol={false}
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
                            data={this.creditScoresList}
                            highlited={creditScoresLoanId}
                        />
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
                            data={this.creditScoresList}
                            highlited={creditScoresLeaseId}
                        />
                    </div>
                </Menu>
                <InfoCard data={infocard}/>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('calculator'));