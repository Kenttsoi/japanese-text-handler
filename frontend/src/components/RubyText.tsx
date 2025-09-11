import React from 'react';
import classes from './RubyText.module.css';

interface RubyTextProps {
    text: string;
    rubyText: string;
    key: number
}

export const RubyText: React.FC<RubyTextProps> = ({ text, rubyText }) => {
    return (
        <>
            <ruby className={classes.rubyText}>
                {text}
                <rp>(</rp><rt>{rubyText}</rt><rp>)</rp>
            </ruby>
        </>
    );
}