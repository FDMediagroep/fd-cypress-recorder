import React from "react";
import { act } from "react-dom/test-utils";
import TestRenderer from "react-test-renderer";
import ReactDOM from "react-dom";
import { FdEventType } from "../../src/utils/FdEvents";
import ContextULCheckCount from "../../src/components/ContextULCheckCount";

describe("Context Menu Count", () => {
    let target: HTMLElement;
    let dummyTarget: HTMLElement;
    const mouseDownMock = jest.fn();
    const backMock = jest.fn();
    const mouseDownEvt = new MouseEvent("mousedown", { bubbles: true });

    beforeEach(() => {
        target = document.createElement("div");
        target.classList.add("context-menu-count-test");
        dummyTarget = document.createElement("div");
        document.body.appendChild(target);
        document.body.appendChild(dummyTarget);
        act(() => {
            ReactDOM.render(
                <ContextULCheckCount
                    onBack={backMock}
                    onMouseDown={mouseDownMock}
                    selector=".context-menu-count-test"
                    target={target}
                />,
                target
            );
        });
    });

    afterEach(() => {
        document.body.removeChild(target);
        document.body.removeChild(dummyTarget);
        target.remove();
        dummyTarget.remove();
        mouseDownMock.mockReset();
        backMock.mockReset();
    });

    it("should render correctly", () => {
        let contextMenu = TestRenderer.create(
            <ContextULCheckCount
                onMouseDown={() => {}}
                selector=".context-menu-count-test"
                target={target}
            />
        );
        expect(contextMenu.toJSON()).toMatchSnapshot();
    });

    it("should handle Equals event correctly", () => {
        [].slice
            .call(target.querySelectorAll("li"))
            .forEach((li: HTMLLIElement) => {
                if (
                    li.textContent &&
                    li.textContent.toLowerCase().indexOf("equals ") > -1
                ) {
                    li.dispatchEvent(mouseDownEvt);
                }
            });
        expect(mouseDownMock).toHaveBeenCalledTimes(1);
        expect(mouseDownMock).toBeCalledWith({
            type: FdEventType.COUNT_EQUALS,
            target: "body > DIV",
            value: 2
        });
    });

    it("should handle Equals custom value event correctly", () => {
        const promptMock = jest.fn();
        promptMock.mockReturnValue("11");
        window.prompt = promptMock;
        [].slice
            .call(target.querySelectorAll("li"))
            .forEach((li: HTMLLIElement) => {
                if (
                    li.textContent &&
                    li.textContent.toLowerCase() === "equals..."
                ) {
                    li.dispatchEvent(mouseDownEvt);
                }
            });
        expect(mouseDownMock).toHaveBeenCalledTimes(1);
        expect(mouseDownMock).toBeCalledWith({
            type: FdEventType.COUNT_EQUALS,
            target: "body > DIV",
            value: 11
        });
    });

    it("should handle Greater than value event correctly", () => {
        const promptMock = jest.fn();
        promptMock.mockReturnValue("30");
        window.prompt = promptMock;
        [].slice
            .call(target.querySelectorAll("li"))
            .forEach((li: HTMLLIElement) => {
                if (
                    li.textContent &&
                    li.textContent.toLowerCase() === "greater than..."
                ) {
                    li.dispatchEvent(mouseDownEvt);
                }
            });
        expect(mouseDownMock).toHaveBeenCalledTimes(1);
        expect(mouseDownMock).toBeCalledWith({
            type: FdEventType.COUNT_GREATER_THAN,
            target: "body > DIV",
            value: 30
        });
    });

    it("should handle Less than value event correctly", () => {
        const promptMock = jest.fn();
        promptMock.mockReturnValue("60");
        window.prompt = promptMock;
        [].slice
            .call(target.querySelectorAll("li"))
            .forEach((li: HTMLLIElement) => {
                if (
                    li.textContent &&
                    li.textContent.toLowerCase() === "less than..."
                ) {
                    li.dispatchEvent(mouseDownEvt);
                }
            });
        expect(mouseDownMock).toHaveBeenCalledTimes(1);
        expect(mouseDownMock).toBeCalledWith({
            type: FdEventType.COUNT_LESS_THAN,
            target: "body > DIV",
            value: 60
        });
        promptMock.mockReset();
    });

    it("should handle Back event correctly", () => {
        [].slice
            .call(target.querySelectorAll("li"))
            .forEach((li: HTMLLIElement) => {
                if (li.textContent && li.classList.contains("back")) {
                    li.dispatchEvent(mouseDownEvt);
                }
            });
        expect(backMock).toHaveBeenCalledTimes(1);
    });
});
