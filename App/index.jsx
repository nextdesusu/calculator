import React from 'react';
import ReactDOM from 'react-dom';

import Menu from './components/Menu';
import Input from './components/Input';
import ButtonsRow from './components/ButtonsRow';
import InfoCard from './components/InfoCard';
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
const load = (item) => parseInt(localStorage.getItem(item), bitDepth10);

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            msrp: load('msrp') || 0,
            tradeIn: load('tradeIn') || 0,
            downPayment: load('downPayment') || 0,
            postCode: load('postCode') || 0,
            mileage: load('mileage') || 0,
            term: load('term') || 0,
            creditScore: load('creditScore') || 0,
            apr: load('apr') || 0,
            termsLoanId: load('termsLoanId') || 0,
        }
    }

    save = (name, value) => {
        this.setState({ [name]: value });
        localStorage.setItem(name, value);
    }

    termsLoanOnclick = (event) => {
        const { target } = event;
        const raw = target.getAttribute('data-index');
        if (raw === null) return;
        const index = parseInt(raw, bitDepth10);
        this.save('termsLoanId', index);
    }

    onChange = (event) => {
        return 1;
    }

    get creditScoreValue() {
        const { creditScore } = this.store;
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

    countMonthlyPaymentLease = () => {
        const {
            msrp,
            tradeIn,
            downPayment,
            mileage,
            term,
        } = this.store;
        const {
            creditScoreValue,
        } = this;
        const termMult = 10000;
        return ((msrp - tradeIn - downPayment) * mileage * creditScoreValue) / (termMult * term)
    }

    countMonthlyPaymentLoan = () => {
        const {
            mileage,
            term,
            apr,
        } = this.state;
        const {
            creditScoreValue,
        } = this;
        return (msrp - tradeIn - downPayment) * term * creditScoreValue * apr;
    }

    render() {
        const { User } = this.props;
        const {
            termsLoanId
        } = this.state;
        const {
            from,
            to,
            step
        } = CREDIT_SCORE;
        const creditScores = [];
        console.log('termsLoanId rendered', termsLoanId)
        return(
            <div>
                <Menu>
                    <Input
                        name='downPayment'
                        onChange={this.onChange}
                        initial={0}
                        symbol='$'
                        preSymbol={true}
                    />
                    <Input
                        name='tradeIn'
                        onChange={this.onChange}
                        initial={0}
                        symbol='$'
                        preSymbol={true}
                    />
                    <Input
                        name='apr'
                        onChange={this.onChange}
                        initial={0}
                        symbol='%'
                        preSymbol={false}
                    />
                    <Input
                        name='postCode'
                        onChange={this.onChange}
                        initial={0}
                        symbol='p'
                        preSymbol={false}
                    />
                    <ButtonsRow
                        onClick={this.termsLoanOnclick}
                        data={TERMS_LOAN}
                        highlited={termsLoanId}
                    />
                    <ButtonsRow
                        onClick={this.termsLoanOnclick}
                        data={creditScores}
                        highlited={1}
                    />
                </Menu>
                <InfoCard
                    MSRPValue={1}
                    vName={'toyota'}
                    monthlyPayment={1}
                    taxesList={[1, 2, 3]}
                    dName={''}
                    dNumber={1}
                    dRating={1}
                />
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('calculator'));