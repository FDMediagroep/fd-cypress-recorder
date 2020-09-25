import React, { useEffect, useState } from 'react';
import HeadersStore = require('../stores/HeadersStore');
import { Header } from '../utils/FdEvents';
import styles from './Headers.module.scss';
import { TextInput } from '@fdmg/design-system/components/input/TextInput';

interface Props {
    headers?: Header[];
}

/**
 * Layout of the HTTP Headers tab in the Chrome Plugin UI
 */
// export default class Headers extends ComponentBase<any, State> {
export default function Headers(props: Props) {
    const [tableData, setTableData] = useState(
        HeadersStore.getHeaders() ??
            props.headers ?? [{ property: '', value: '' }]
    );

    useEffect(() => {
        const headerId = HeadersStore.subscribe(() => {
            const headers = HeadersStore.getHeaders() ?? props.headers;
            if (headers.length === 0) {
                headers.push({ property: '', value: '' });
            }
            setTableData(headers);
        });

        const headers = HeadersStore.getHeaders() ?? props.headers;
        if (headers.length === 0) {
            headers.push({ property: '', value: '' });
        }
        setTableData(headers);

        return () => {
            HeadersStore.unsubscribe(headerId);
        };
    }, []);

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
        <table>
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
                                id={`${data.property}-${data.value}`}
                                type="text"
                                className={styles.input}
                                defaultValue={data.property}
                                data-row={rowIndex}
                                data-column="property"
                                onChange={handleHeaderChange}
                            />
                        </td>
                        <td>
                            <TextInput
                                id={`${data.property}-${data.value}`}
                                type="text"
                                className={styles.input}
                                defaultValue={data.value}
                                data-row={rowIndex}
                                data-column="value"
                                onChange={handleHeaderChange}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
