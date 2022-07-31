import React from 'react';

import "./stylesheets/App.css";

import StyledTextArea from "./StyledTextArea";
import { transform } from './transform';
import { promiseReverse } from "./reverse";

const initialStarterText = "";

type AppProps = {};
type AppState = {
    inputText: string,
    outputText: string,
    shouldFormat: boolean,
    error?: string,
    reverseError?: string
};

enum GA_TRACKING_CATEGORIES {
    TRANSLATION = "Translation",
}

enum TRANSLATION_ACTIONS {
    TO_CSS = "To CSS",
    FROM_CSS = "From CSS",
}

export default class App extends React.Component<AppProps, AppState> {


    componentDidMount(): void {
        if (typeof window !== "undefined") {
            const path = window.location.pathname + window.location.search;
        }
    }

    constructor(props) {
        super(props);
        this.update = this.update.bind(this);
        this.inputTextUpdate = this.inputTextUpdate.bind(this);
        this.outputTextUpdate = this.outputTextUpdate.bind(this);

        this.state = {
            inputText: initialStarterText,
            outputText: initialStarterText,
            shouldFormat: false
        };


    }

    inputTextUpdate(e) {
        this.setState({
            inputText: e.target.value
        }, this.update);
    }

    outputTextUpdate(e) {
        this.setState({
            outputText: e.target.value
        }, () => {
            let outputText = this.state.outputText;
            if (outputText === initialStarterText) {
                this.setState({
                    outputText: initialStarterText,
                    reverseError: null
                });
                return;
            }

            return promiseReverse(outputText)
                .then(result => {
                    this.trackTranslation(TRANSLATION_ACTIONS.TO_CSS);

                    this.setState({
                        inputText: result.css,
                        reverseError: null
                    })
                })
                .catch(error => {
                    this.setState({
                        reverseError: error
                    })
                });
        });
    }

    update(shouldFormat = this.state.shouldFormat) {

        console.log('update', arguments);

        if (this.state.inputText === initialStarterText) {
            this.setState({
                inputText: initialStarterText,
                error: null
            });
            return;
        }

        try {
            let transformed = transform(this.state.inputText);

            let result = JSON.stringify(transformed, null, shouldFormat ? 2 : 0);

            this.trackTranslation(TRANSLATION_ACTIONS.FROM_CSS);

            this.setState({
                outputText: result,
                error: null,
                shouldFormat
            });
        } catch (ex) {
            this.setState({
                error: ex
            });
        }
    }

    render() {
        console.log('state', this.state);
        let inputText = this.state.reverseError || this.state.inputText;
        let outputText = this.state.error || this.state.outputText;

        return (
            <div className="App-Container">
                <div style={{
                    "display": "flex",
                    "flexDirection": "row",
                    "flexWrap": "nowrap",
                    "justifyContent": "space-between",
                    "paddingLeft": "7px",
                    "paddingRight": "7px",
                }}>
                    <div>CSS:</div>
                    <div style={{
                        "WebkitUserSelect": "none",
                        "userSelect": "none",
                        "cursor": "pointer"
                    }} onClick={() => {
                        window.navigator['clipboard'].writeText(inputText);
                    }}>Copy</div>
                </div>
                <StyledTextArea
                    placeholder="Type or paste CSS here..."
                    onChange={this.inputTextUpdate}
                    value={inputText}
                    isError={!!this.state.reverseError}
                />

                <div style={{
                    "display": "flex",
                    "flexDirection": "row",
                    "flexWrap": "nowrap",
                    "justifyContent": "space-between",
                    "paddingLeft": "7px",
                    "paddingRight": "7px",
                }}>
                    <div>React in-line style:</div>
                    <div style={{
                        "WebkitUserSelect": "none",
                        "userSelect": "none",
                        "cursor": "pointer"
                    }} onClick={() => {
                        window.navigator['clipboard'].writeText(outputText);
                    }}
                    >Copy</div>
                </div>
                <StyledTextArea
                    placeholder="Type or paste React in-line style object here..."
                    onChange={this.outputTextUpdate}
                    value={outputText}
                    isError={!!this.state.error}
                />
                <br />

                {
                    inputText.length != 0 && <div >
                        <div style={{ "paddingTop": "10px" }}></div>
                        <button style={{
                            "cursor": "pointer",
                            "backgroundColor": "#2e2e2e",
                            "border": "none",
                            "color": "white",
                            "textAlign": "center",
                            "textDecoration": "none",
                            "display": "inline-block",
                            "fontSize": "16px",
                            "width": "100px",
                            "paddingTop": "6px",
                            "paddingBottom": "6px",
                        }} onClick={() => {
                            this.inputTextUpdate({ target: { value: '' } });
                            this.outputTextUpdate({ target: { value: '' } });
                        }}
                        >Clear</button>
                        <div style={{ "paddingLeft": "10px", "display": "inline" }}></div>
                        <input
                            id="checkbox-format"
                            className="checkbox-format"
                            checked={this.state.shouldFormat}
                            type="checkbox"
                            onChange={e => this.update(e.target.checked)}
                            style={{ "display": "none" }}
                        />
                        <label htmlFor="checkbox-format" style={{
                            "cursor": "pointer",
                            "backgroundColor": "#2e2e2e",
                            "border": "none",
                            "color": "white",
                            "textAlign": "center",
                            "textDecoration": "none",
                            "display": "inline-block",
                            "fontSize": "16px",
                            "width": "100px",
                            "paddingTop": "3px",
                            "paddingBottom": "3px",
                            "WebkitUserSelect": "none",
                            "userSelect": "none"
                        }}>Format</label>
                    </div>
                }

            </div>
        );
    }

    private trackTranslation(action: TRANSLATION_ACTIONS) {

    }
}
