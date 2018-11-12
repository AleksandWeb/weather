function sum(a,b) {
    return a+b;
}

describe('test of tests', () => {
    it('test', () => {
        expect(sum(5,2)).toEqual(7);
    });
});