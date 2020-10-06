import { Bar, Label, Switch } from '@ui5/webcomponents-react';
import { setTheme } from '@ui5/webcomponents-base/dist/config/Theme';
import '@ui5/webcomponents/dist/Assets';
import '@ui5/webcomponents-fiori/dist/Assets';
import React, { useState } from 'react'

function Header() {
    const [checked, setChecked] = useState(false);

    const handleThemeSwitch = () => {
        setTheme(checked ? "sap_fiori_3" : "sap_fiori_3_dark");
        setChecked(!checked);
    };

    return (
        <div style={{ position: "sticky", top: "0", zIndex: "10" }}>
            <Bar 
                contentLeft={<Label required={false} showColon={false} wrap={false}>Covid-19 Tracker</Label>}
                contentRight={
                    <Switch style={{ width: '70px' }} checked={checked} onChange={handleThemeSwitch} textOff="Light" textOn="Dark" />
                }
                design="Header"
            />
        </div>
    )
}

export default Header
