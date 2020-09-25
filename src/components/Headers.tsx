import React, { useCallback, useEffect, useState } from 'react';
import HeadersStore = require('../stores/HeadersStore');
import { Header } from '../utils/FdEvents';
import styles from './Headers.module.scss';
import { TextInput } from '@fdmg/design-system/components/input/TextInput';
import { ReSubstitute } from '../utils/ReSubstitute';

interface Props {
    headers?: Header[];
    [x: string]: any;
}

/**
 * Layout of the HTTP Headers tab in the Chrome Plugin UI
 */
// export default class Headers extends ComponentBase<any, State> {
export default function Headers(props: Props) {
    const getHeaders = useCallback(() => {
        return HeadersStore.getHeaders().length
            ? HeadersStore.getHeaders()
            : props.headers ?? [{ property: '', value: '' }];
    }, [HeadersStore.getHeaders().length, props.headers]);
    const [tableData, setTableData] = useState(getHeaders());

    useEffect(() => {
        const headerId = HeadersStore.subscribe(() => {
            setTableData(getHeaders());
        }, ReSubstitute.Key_All);

        const headers = getHeaders();
        if (headers.length === 0) {
            headers.push({ property: '', value: '' });
            HeadersStore.setHeaders(headers);
        }

        return () => {
            HeadersStore.unsubscribe(headerId);
        };
    }, [getHeaders]);

    const removeMultipleEmptyRows = (tblData: Header[]) => {
        return tblData.reduce((prev: Header[], header) => {
            const found = prev.find(
                (h: Header) =>
                    h.property === header.property && h.value === header.value
            );
            if (!found || header.property !== '' || header.value !== '') {
                prev.push(header);
            }
            return prev;
        }, []);
    };

    const handleHeaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const changedCol = e.currentTarget.getAttribute('data-column');
        const changedRow = parseInt(
            e.currentTarget.getAttribute('data-row') || '-1',
            10
        );
        let tblData: Header[] = [...tableData];
        let addNewRow = true;
        tblData =
            tblData.map<any>((data: Header, rowIndex) => {
                if (rowIndex === changedRow) {
                    switch (changedCol) {
                        case 'property':
                            return { ...data, property: e.currentTarget.value };
                        case 'value':
                            return { ...data, value: e.currentTarget.value };
                    }
                } else {
                    return { ...data };
                }
                if (!data.property && !data.value) {
                    addNewRow = false;
                }
            }) || [];
        if (addNewRow) {
            tblData.push({ property: '', value: '' });
        }
        tblData = removeMultipleEmptyRows(tblData);
        HeadersStore.setHeaders(tblData);
    };

    return (
        <table
            className={`${styles.table}${
                props.className ? ` ${props.className}` : ''
            }`}
        >
            <thead>
                <tr>
                    <td>Property</td>
                    <td>Value</td>
                </tr>
            </thead>
            <tbody>
                {tableData.map((data, rowIndex) => (
                    <tr key={rowIndex}>
                        <td>
                            <TextInput
                                id={`${data.property}-${data.value}-property`}
                                type="text"
                                name="property"
                                className={styles.input}
                                defaultValue={data.property}
                                data-row={rowIndex}
                                data-column="property"
                                placeholder="New placeholder"
                                label="Property"
                                onChange={handleHeaderChange}
                            />
                        </td>
                        <td>
                            <TextInput
                                id={`${data.property}-${data.value}-value`}
                                type="text"
                                name="value"
                                className={styles.input}
                                defaultValue={data.value}
                                data-row={rowIndex}
                                data-column="value"
                                placeholder="New value"
                                label="Value"
                                onChange={handleHeaderChange}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
