import React, { Component, createRef } from 'react';
import { TextInput } from 'react-native';
import BaseTextComponent from './base-text-component';

class TextInputMask extends BaseTextComponent {
    constructor(props) {
        super(props);
        this._inputElement = createRef();
    }

    getElement() {
        return this._inputElement.current;
    }

    _onChangeText = (text) => {
        if (!this._checkText(text)) {
            return;
        }

        const { maskedText, rawText } = this.updateValue(text);

        if (this.props.onChangeText) {
            this._trySetNativeProps(maskedText);
            this.props.onChangeText(maskedText, rawText);
        }
    }

    _trySetNativeProps(maskedText) {
        try {
            const element = this.getElement();
            element.setNativeProps && element.setNativeProps({ text: maskedText });
        } catch (error) {
            // silent
        }
    }

    _checkText(text) {
        if (this.props.checkText) {
            return this.props.checkText(this.props.value, text);
        }

        return true;
    }

    _getKeyboardType() {
        return this.props.keyboardType || this._maskHandler.getKeyboardType();
    }

    render() {
        const { customTextInput: CustomTextInput, customTextInputProps = {}, refInput, ...otherProps } = this.props;
        const Input = CustomTextInput || TextInput;

        return (
            <Input
                ref={this._inputElement}
                keyboardType={this._getKeyboardType()}
                {...otherProps}
                {...customTextInputProps}
                onChangeText={this._onChangeText}
                value={this.getDisplayValueFor(this.props.value)}
            />
        );
    }
}

// Encapsular TextInputMask com React.forwardRef para encaminhar a referência
export default React.forwardRef((props, ref) => (
    <TextInputMask {...props} refInput={ref} />
));
