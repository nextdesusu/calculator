import React from 'react';
import ReactDOM from 'react-dom';
import Input from './components/Input';
import './index.css';

class App extends React.Component {
    render() {
        return(
            <div>
                <p>ok</p>
                <Input
                    onChange={() => 1}
                    initial={5}
                    preSymbol='$'
                />
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('calculator'));