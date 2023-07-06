// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

class MockIntersectionObserver implements IntersectionObserver {
    readonly root: Element | null = null;
    readonly rootMargin: string = "";
    readonly thresholds: ReadonlyArray<number> = [];
    observe: (target: Element) => void = () => null;
    unobserve: (target: Element) => void = () => null;
    disconnect: () => void = () => null;
    takeRecords: () => IntersectionObserverEntry[] = () => [];

    constructor(
        callback: IntersectionObserverCallback,
        options?: IntersectionObserverInit,
    ) {}
}
const root = document.createElement("div");
root.id = "root";
document.body.appendChild(root);

global.IntersectionObserver = MockIntersectionObserver;
