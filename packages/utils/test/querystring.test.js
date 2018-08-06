import {parse} from '../src/queryString';
describe('queryString',()=>{
    test('parse query:d=罗1&c=bb to {d:"罗1",c:"bb"}',()=>{
        expect(parse('d=罗1&c=bb')).toEqual({d:"罗1",c:"bb"});
    })
})
