import React, { CSSProperties } from 'react';
import ReactDOM from 'react-dom';

import "./stylesheets/StyledTextArea.css"

type StyledTextAreaProps = {
    value: string,
    placeholder: string,
    onChange: (event) => void,
    style?: CSSProperties,
    isError?: boolean
};
type StyledTextAreaState = {};

const TEXTAREA_ERROR_CLASS = "textarea-error";

export default class StyledTextArea extends React.Component<StyledTextAreaProps, StyledTextAreaState> {
    static defaultProps: Partial<StyledTextAreaProps> = {
        isError: false
    };

    componentDidUpdate(prevProps) {
        let node = ReactDOM.findDOMNode(this) as HTMLInputElement;
        let oldLength = node.value.length;
        let oldIdx = node.selectionStart;
        node.value = this.props.value;
        let newIdx = Math.max(0, node.value.length - oldLength + oldIdx);
        node.selectionStart = node.selectionEnd = newIdx;
    }

    render() {
        const { isError, ...otherProps } = this.props;
        const className = isError ? TEXTAREA_ERROR_CLASS : "";
        return <textarea
            spellCheck="false"
            style={{
                "width": "95%",
                "height": "200px",
                "backgroundColor": "#1e1e1e",
                "color": "#00ff41",
                "borderRadius": "5px",
                "padding": "10px",
                "resize": "none"
            }} {...otherProps} value={undefined} className={className} />;
    }
}
