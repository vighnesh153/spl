import { helloWorld } from 'src/main';

test('check initialization', () => {
    expect(helloWorld()).toBe("Hello world.");
});
